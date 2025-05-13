from fastapi.routing import APIRoute, APIRouter
from sqlalchemy.orm.session import Session
import schema
from database import get_db
from fastapi import HTTPException, Depends
from utils.validation import userRoleEnumMapping, verify_password, hash_password, validate_password_strength
import modules
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_201_CREATED, HTTP_409_CONFLICT
from utils.jwt import create_access_token
from utils.authorization import require_roles


# This file for the admin routers only



router = APIRouter(
    prefix="/api",
    tags=["auth"]
)

@router.get("/admin-only")
def admin_panel(user=Depends(require_roles("admin"))):
    return {"message": f"Welcome admin {user['sub']}"}
