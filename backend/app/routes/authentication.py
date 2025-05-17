from typing_extensions import List
from utils.authorization import require_roles
from fastapi.routing import APIRoute, APIRouter
from sqlalchemy.orm.session import Session
import schema
from database import get_db
from fastapi import HTTPException, Depends
from utils.validation import userRoleEnumMapping, verify_password, hash_password, validate_password_strength
import modules
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_201_CREATED, HTTP_409_CONFLICT
from utils.jwt import create_access_token



router = APIRouter(
    prefix="/api",
    tags=["auth"]
)



# Here allowing user to sigeup the endpoint accepts
# json format data and the input should match
# the schema SignUpRequest. As showen below
@router.post("/signup", status_code=HTTP_201_CREATED)
def signup(user: schema.SignUpRequest, db: Session = Depends(get_db)):
    # fetch  data from the database
    user_db = db.query(modules.Users).filter(modules.Users.username == user.username).first()

    # check if the username alredy exist
    if user_db is not None :
        raise HTTPException(status_code=HTTP_409_CONFLICT, detail="Username already exists")

    # not nessary but checking if the username is bigger than 5 chars
    if len(user.username) < 6 :
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="username should be 6 char min")

    # checking if the password used is strong or not
    validate_password_strength(user.password)

    # hashing the user password
    user.password = hash_password(user.password)

    # mapping the role. READ THE COMMENT ABOVE THE FUNCTION TO UNDERSTAND
    role = userRoleEnumMapping(user.role)

    # Creating new user object
    user_new = modules.Users(
        **user.dict(exclude={"role"}),  # exclude role from Pydantic dict
        role=role
    )

    # adding the user to the database and commit the changes
    db.add(user_new)
    db.commit()
    db.refresh(user_new)



# almost same as above
@router.post("/login")
def login(user: schema.LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(modules.Users).filter(modules.Users.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {
        "sub": db_user.username,
        "role": db_user.role.value,
        "user_id": db_user.user_id
    }

    access_token = create_access_token(token_data)
    return {"access_token": access_token, "token_type": "bearer"}



@router.get("/sesstion", response_model=List[schema.UserInfo])
def get_current_user_role(user=Depends(require_roles("admin", "librarian", "user")), db:Session = Depends(get_db)):
    current_user = db.query(modules.Users).filter(modules.Users.user_id == user["user_id"]).first();
    return current_user
