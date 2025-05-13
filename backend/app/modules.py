from sqlalchemy import create_engine, Column, Integer, String, Enum
import enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from database import Base


# represent the allowed roles
class RoleEnum(enum.Enum):
    admin = "admin"
    librarian = "librarian"
    user = "user"

# Define the User class (which will be mapped to the 'user' table)
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
