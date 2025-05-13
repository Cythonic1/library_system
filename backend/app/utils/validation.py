from passlib.context import CryptContext
import re
from fastapi import HTTPException
from schema import RoleEnumUser
from modules import RoleEnum


# Bcrypt context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)



# Here just to check the password strength
def validate_password_strength(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password too short. Minimum 8 characters required.")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="Password must include at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        raise HTTPException(status_code=400, detail="Password must include at least one lowercase letter.")
    if not re.search(r"[0-9]", password):
        raise HTTPException(status_code=400, detail="Password must include at least one number.")
    if not re.search(r"[\W_]", password):
        raise HTTPException(status_code=400, detail="Password must include at least one special character.")



# here we mapping from the RoleEnumUser to ROleEnum
# Since the user has limited access to create user
# so there are two enum the RoleEnumUser does not
# hold admin value there for user can not became and admin
# maybe change it to became user only where the admin only
# can make users with different roles
def userRoleEnumMapping(role: RoleEnumUser ) -> RoleEnum:
    if role == RoleEnumUser.librarian :
        return RoleEnum.librarian
    elif role == RoleEnumUser.user:
        return RoleEnum.user
