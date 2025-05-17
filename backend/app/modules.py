import schema
from sqlalchemy import create_engine, Column, Integer, String, Enum, DateTime, ForeignKey,Date, Boolean, Text, DECIMAL
import enum
from sqlalchemy.orm import declarative_base, relationship
import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from database import Base




# Define the User class (which will be mapped to the 'user' table)
# class User(Base):
#     __tablename__ = 'users'
#     id = Column(Integer, primary_key=True)
#     username = Column(String(255), nullable=False)
#     password = Column(String(255), nullable=False)
#     role = Column(Enum(RoleEnum), nullable=False)


# class UserRole(enum.Enum):
#     admin = "admin"
#     librarian = "librarian"
#     user = "user"




class Users(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), unique=True, nullable=False)
    password = Column(String(765), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(Enum(schema.RoleEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    books_added = relationship("Books", back_populates="added_by_user")
    borrowings = relationship("BorrowedBooks", back_populates="user")
    notifications = relationship("Notifications", back_populates="user")

class Books(Base):
    __tablename__ = 'books'

    book_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    desc = Column(String(255), nullable=False)
    publication_year = Column(Integer)  # SQLAlchemy doesn't have a Year type
    genre = Column(String(100))
    counter = Column(Integer, default=0)
    availability_status = Column(Enum(schema.AvailabilityStatus), default=schema.AvailabilityStatus.available)
    url = Column(String(255), nullable=True)


    added_by = Column(Integer, ForeignKey('users.user_id'))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    added_by_user = relationship("Users", back_populates="books_added")
    borrowings = relationship("BorrowedBooks", back_populates="book")

class BorrowedBooks(Base):
    __tablename__ = 'borrowed_books'

    borrow_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    book_id = Column(Integer, ForeignKey('books.book_id'))
    borrow_date = Column(Date, default=datetime.date.today)
    created_at = Column(Date, nullable=True)  # Set to NULL until return
    fee_amount = Column(DECIMAL(10, 2), default=0.00)
    fee_paid = Column(Boolean, default=False)

    user = relationship("Users", back_populates="borrowings")
    book = relationship("Books", back_populates="borrowings")
    notifications = relationship("Notifications", back_populates="borrow")


class Notifications(Base):
    __tablename__ = 'notifications'

    notification_id = Column(Integer, primary_key=True, autoincrement=True)
    borrow_id = Column(Integer, ForeignKey('borrowed_books.borrow_id'))
    user_id = Column(Integer, ForeignKey('users.user_id'))
    message = Column(Text, nullable=False)
    sent_date = Column(DateTime, default=datetime.datetime.utcnow)
    accessed = Column(Boolean, default=False)

    borrow = relationship("BorrowedBooks", back_populates="notifications")
    user = relationship("Users", back_populates="notifications")
