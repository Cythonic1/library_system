from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import enum
import modules

# this is pydantic schema used for input validation
# refre to document if you do not know how to use it
# or you can check the authentication.py file
# to see some examples MUST USED


class RoleEnumUser(enum.Enum):
    def __str__(self):
            return str(self.value)
    librarian = "librarian"
    user = "user"


class LoginRequest(BaseModel):
    username: str
    password: str

class SignUpRequest(BaseModel):
    username: str
    password: str
    role : RoleEnumUser
