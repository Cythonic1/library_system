from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from utils.authorization import require_roles
import modules
import schema
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/api/notifications",
    tags=["notifications"]
)

### 1. Send Notifications for Borrowed Books Near Expiry
@router.post("/send")
def send_notifications(db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "librarian"))):
    # Find borrowed books with 1 day remaining
    one_day_from_now = datetime.utcnow() + timedelta(days=1)
    borrowed_books = db.query(modules.BorrowedBooks).filter(
        modules.BorrowedBooks.borrow_date + timedelta(days=14) == one_day_from_now
    ).all()

    if not borrowed_books:
        return {"detail": "No notifications to send"}

    notifications = []
    for borrowed in borrowed_books:
        # Create a notification for each matching borrowed book
        message = f"Dear user, your borrowed book (ID: {borrowed.book_id}) is due in 1 day. Please return it on time to avoid late fees."
        notification = modules.Notifications(
            borrow_id=borrowed.borrow_id,
            user_id=borrowed.user_id,
            message=message,
            sent_date=datetime.utcnow(),
            accessed=False
        )
        db.add(notification)
        notifications.append(notification)

    db.commit()

    return {
        "detail": f"Sent {len(notifications)} notifications",
        "notifications": [n.notification_id for n in notifications]
    }


### 2. List All Notifications for a User
@router.get("/", response_model=list[schema.NotificationOut])
def get_user_notifications(db: Session = Depends(get_db), current_user=Depends(require_roles("user", "admin", "librarian"))):
    notifications = db.query(modules.Notifications).filter_by(user_id=current_user["user_id"]).all()
    return notifications


### 3. Mark a Notification as Accessed
@router.put("/{notification_id}/accessed", response_model=schema.NotificationOut)
def mark_notification_accessed(notification_id: int, db: Session = Depends(get_db), current_user=Depends(require_roles("user", "admin", "librarian"))):
    notification = db.query(modules.Notifications).filter_by(notification_id=notification_id, user_id=current_user["user_id"]).first()

    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    notification.accessed = True
    db.commit()
    db.refresh(notification)

    return notification
