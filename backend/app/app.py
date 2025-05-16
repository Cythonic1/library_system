from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm.session import Session
from utils.validation import hash_password, userRoleEnumMapping, validate_password_strength, verify_password
from utils.jwt import create_access_token
from utils.authorization import get_current_user, require_roles
import modules
from database import get_db, engine
import schema
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_201_CREATED, HTTP_409_CONFLICT
from routes.authentication import router as auth_router
from routes.admin import router as admin_roure
from routes.books import  router as books_routes

app = FastAPI()


# the will generate the table from the modules file
# if you want to create table put it in the module file as
# the require format
modules.Base.metadata.create_all(engine)

# just a main route for testing
@app.route("/")
def welcome():
    return "Hello world"


# including the routers from the other files
app.include_router(auth_router)
app.include_router(admin_roure)
app.include_router(books_routes)
