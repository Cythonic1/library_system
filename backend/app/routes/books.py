from fastapi.routing import APIRoute, APIRouter
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


# this file for librarin routers or shared with admin only


router = APIRouter(
    prefix="/api/books",
    tags=["librarian"]
)


# THis how you can make a router that allows for both the admin and librarian
# Or you can change the require_roles prameters and make it only for librarian
@router.get("/library-section")
def librarian_or_admin(user=Depends(require_roles("admin", "librarian"))):
    return {"message": f"{user['role']} has access"}

# get all books
@router.get("/", status_code=status.HTTP_200_OK)
def list_books(
    db: Session = Depends(get_db),
    current_user = Depends(require_roles("admin", "librarian", "users"))
):
    return db.query(modules.Books).all()



# delete a single book with Id
@router.delete("/{book_id}", status_code=status.HTTP_200_OK)
def delete_book(
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
def update_book(
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
def get_book(
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
def create_book(
    book: schema.BookCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles("admin", "librarian"))
):
    book_new = modules.Books(**book.dict())
    book_new.added_by = current_user["user_id"]
    book_new.counter = book.counter;
    book_new.availability_status = counterCheck(book_new.counter)
    db.add(book_new)
    db.commit()
    db.refresh(book_new)
    return book_new


@router.put("/borrowed/{book_id}", status_code=status.HTTP_200_OK)
def borrowed(book_id: int, db: Session = Depends(get_db), current_user = Depends(require_roles("admin", "librarian", "users"))):
    book = db.query(modules.Books).filter(modules.Books.book_id == book_id).first()

    if not book:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Book not found")


    if book.availability_status != schema.AvailabilityStatus.available:
        raise HTTPException(status_code=HTTP_409_CONFLICT, detail="Not enough books available")

    book.counter = book.counter - 1
    book.availability_status = counterCheck(book.counter)
    borrowed = modules.BorrowedBooks(
            user_id=current_user["user_id"],
            book_id=book.book_id,
            borrow_date=datetime.datetime.utcnow(),
            created_at=datetime.datetime.utcnow()
    )
    db.add(borrowed)
    db.commit()
    db.refresh(book)
