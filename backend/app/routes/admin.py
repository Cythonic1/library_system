from datetime import datetime
from typing_extensions import List
from fastapi.routing import APIRoute, APIRouter
from sqlalchemy.orm.session import Session
import schema
from database import get_db
import modules
from fastapi import HTTPException, Depends
from utils.validation import userRoleEnumMapping, verify_password, hash_password, validate_password_strength
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_201_CREATED, HTTP_409_CONFLICT, HTTP_200_OK
from utils.jwt import create_access_token
from utils.authorization import require_roles


# This file for the admin routers only



router = APIRouter(
    prefix="/api/admin",
    tags=["auth"]
)

@router.get("/admin-only")
def admin_panel(user=Depends(require_roles("admin"))):
    return {"message": f"Welcome admin {user['sub']}"}



# adding user with the admin and librarin roles
@router.post("/users/add_users", status_code=HTTP_200_OK)
def add_users_admin(user: schema.SignUpRequestAdmin, db:Session = Depends(get_db)):
    # fetch  data from the database
    user_db = db.query(modules.Users).filter(modules.Users.username == user.username).first()

    # check if the username alredy exist
    if user_db is not None :
        raise HTTPException(status_code=HTTP_409_CONFLICT, detail="Username already exists")


    email_db = db.query(modules.Users).filter(modules.Users.email == user.email).first()
    if email_db is not None:
        raise HTTPException(status_code=HTTP_409_CONFLICT, detail="Email already exists")

    # not nessary but checking if the username is bigger than 5 chars
    if len(user.username) < 6 :
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="username should be 6 char min")

    # checking if the password used is strong or not
    validate_password_strength(user.password)

    # hashing the user password
    user.password = hash_password(user.password)
    print(user.role.value)

    # Creating new user object
    user.role = schema.RoleEnum(user.role)
    user_new = modules.Users(**user.dict())

    # adding the user to the database and commit the changes
    db.add(user_new)
    db.commit()
    db.refresh(user_new)



# Getting all the users
@router.get("/users", response_model=List[schema.UserOutAdmin], status_code=HTTP_200_OK)
def get_all_users(db: Session = Depends(get_db), current_user = Depends(require_roles("admin"))):
    users = db.query(modules.Users).all()
    return users


# update users
@router.put("/users/{user_id}")
def update_user(user_id: int, user_update: schema.UpdateUserRequestAdmin, db: Session = Depends(get_db), current_user = Depends(require_roles("admin"))):
    user_db = db.query(modules.Users).filter(modules.Users.user_id == user_id).first()

    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")

    # Optional: update only provided fields
    if user_update.username:
        user_db.username = user_update.username
    if user_update.email:
        user_db.email = user_update.email
    if user_update.role:
        user_db.role = schema.RoleEnum(user_update.role)
    user_db.updated_at = datetime.now()

    db.commit()
    db.refresh(user_db)
    return {"msg": "User updated successfully", "user": user_db}



# deleting single user
@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user = Depends(require_roles("admin"))):
    user = db.query(modules.Users).filter(modules.Users.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"msg": "User deleted successfully"}
