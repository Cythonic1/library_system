from fastapi.routing import APIRoute, APIRouter, Request
from sqlalchemy.orm.session import Session
import schema
import datetime
from database import get_db
from fastapi import HTTPException, Depends,status
from utils.validation import counterCheck, userRoleEnumMapping, verify_password, hash_password, validate_password_strength
import modules
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_201_CREATED, HTTP_409_CONFLICT
from utils.jwt import create_access_token
from utils.authorization import require_roles
from slowapi.util import get_remote_address
from slowapi import Limiter

# this file for librarin routers or shared with admin only


router = APIRouter(
    prefix="/api/books",
    tags=["librarian"]
)
limiter = Limiter(key_func=get_remote_address)

def send_notification_to_user(
    user_id: int,
    message: str,
    borrow_id: int = None,
        db: Session = None  
):
    """
    Send a notification to a specific user
    """
    # Check if user exists
    user = db.query(modules.Users).filter(modules.Users.user_id == user_id).first()
    if not user:
        raise HTTPException(
            detail="User not found"
        )

    # Create notification
    notification = modules.Notifications(
        borrow_id=borrow_id,
        user_id=user_id,
        message=message,
        sent_date=datetime.datetime.utcnow(),
        accessed=False
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    return notification



# THis how you can make a router that allows for both the admin and librarian
# Or you can change the require_roles prameters and make it only for librarian
@router.get("/library-section")
@limiter.limit("5/minute")
def librarian_or_admin(request:Request,user=Depends(require_roles("admin", "librarian"))):
    return {"message": f"{user['role']} has access"}

# get all books
@router.get("/", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")

def list_books(
    request:Request,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles("admin", "librarian", "user"))
):
    return db.query(modules.Books).all()



# delete a single book with Id
@router.delete("/{book_id}", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")

def delete_book(
    request:Request,
    book_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles("admin", "librarian"))
):
    book = db.query(modules.Books).filter_by(book_id=book_id).first()
    if not book:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Book not found")

    db.delete(book)
    db.commit()
    return {"detail": "Book deleted successfully"}


# update book by its ID
@router.put("/{book_id}", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
def update_book(
            request:Request,
    book_id: int,
    book_data: schema.BookUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles("admin", "librarian"))
):
    book = db.query(modules.Books).filter_by(book_id=book_id).first()
    if not book:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Book not found")
    if all(
        value is None for key, value in book_data.dict(exclude={"availability_status"}).items()
    ):
        raise HTTPException(status_code=304, detail="No changes provided")

    # Apply updates only for provided fields
    for field, value in book_data.dict(exclude_unset=True).items():
        setattr(book, field, value)
    book.availability_status = counterCheck(book.counter)

    db.commit()
    db.refresh(book)
    return book



#get a single book with id
@router.get("/{book_id}", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
def get_book(
            request:Request,
    book_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles("admin", "librarian", "user"))
):
    book = db.query(modules.Books).filter_by(book_id=book_id).first()
    if not book:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Book not found")
    return book


# create new book
@router.post("/create", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def create_book(
            request:Request,
    book: schema.BookCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles("admin", "librarian"))
):
    book_new = modules.Books(**book.dict())
    book_new.added_by = current_user["user_id"]
    book_new.counter = book.counter
    book_new.availability_status = counterCheck(book_new.counter)
    db.add(book_new)
    db.commit()
    db.refresh(book_new)
    return book_new




@router.put("/borrowed/{book_id}", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
def borrowed(request:Request,book_id: int, db: Session = Depends(get_db), current_user = Depends(require_roles("admin", "librarian", "user"))):
    book = db.query(modules.Books).filter(modules.Books.book_id == book_id).first()

    if not book:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Book not found")

    if book.availability_status != schema.AvailabilityStatus.available:
        raise HTTPException(status_code=HTTP_409_CONFLICT, detail="Not enough books available")

    book.counter -= 1
    book.availability_status = counterCheck(book.counter)

    borrowed = modules.BorrowedBooks(
        user_id=current_user["user_id"],
        book_id=book.book_id,
        borrow_date=datetime.datetime.utcnow(),
        created_at=datetime.datetime.utcnow()
    )


  

    db.add(borrowed)
    db.commit()  
    db.refresh(borrowed) 
    db.refresh(book)
    send_notification_to_user(
        user_id=current_user["user_id"],
        message=f"You borrowed '{book.title}'",
        borrow_id=borrowed.borrow_id,
        db=db
    )
    return {"detail": "Book borrowed successfully", "borrow_id": borrowed.borrow_id}



@router.get("/opt/counter" ,status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
def book_counter(        request:Request,db: Session = Depends(get_db)):
    count = db.query(modules.Books).count()

    return {"total books":count}
