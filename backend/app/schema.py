from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

# this is pydantic schema used for input validation
# refre to document if you do not know how to use it
# or you can check the authentication.py file
# to see some examples MUST USED
# represent the allowed roles
class RoleEnum(Enum):
    admin = "admin"
    librarian = "librarian"
    user = "user"

class VerifyOTP(BaseModel):
    email: str
    otp: str

class RoleEnumUser(Enum):
    def __str__(self):
            return str(self.value)
    librarian = "librarian"
    user = "user"

class AvailabilityStatus(str, Enum):
    available = "available"
    unavailable = "unavailable"

class LoginRequest(BaseModel):
    username: str
    password: str

class SignUpRequest(BaseModel):
    username: str
    password: str
    email: EmailStr

class SignUpRequestAdmin(BaseModel):
    username: str
    password: str
    email: EmailStr
    role: RoleEnum


class UserInfo(BaseModel):
    user_id: int
    username: str
    email: str
    role: RoleEnum
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class UserOutAdmin(BaseModel):
    user_id: int
    username: str
    email: str
    role: RoleEnum
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True



class UpdateUserRequestAdmin(BaseModel):
    username: Optional[str]
    email: Optional[str]
    role: Optional[str]




class BookBase(BaseModel):
    title: str
    author: str
    publication_year: Optional[int] = None
    desc: str
    genre: Optional[str] = None
    url: str
    counter: int

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    publication_year: Optional[int] = None
    genre: Optional[str] = None
    availability_status: Optional[AvailabilityStatus] = AvailabilityStatus.available
    counter: Optional[int] = None
    url : Optional[str] = None
    desc: Optional[str] = None

class BookOut(BookBase):
    book_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class NotificationCreate(BaseModel):
    borrow_id: int
    user_id: int
    message: str
    sent_date: datetime = Field(default_factory=datetime.utcnow)
    accessed: bool = False

class NotificationOut(BaseModel):
    notification_id: int
    borrow_id: int
    user_id: int
    message: str
    sent_date: datetime
    accessed: bool

    class Config:
        orm_mode = True
