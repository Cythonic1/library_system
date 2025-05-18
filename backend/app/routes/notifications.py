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
