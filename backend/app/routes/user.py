
# this file for users , admin, libaraina

from fastapi.routing import APIRoute, APIRouter
from sqlalchemy.orm.session import Session
import schema
from database import get_db
from fastapi import HTTPException, Depends,Request
from utils.validation import counterCheck, userRoleEnumMapping, verify_password, hash_password, validate_password_strength
import modules
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_201_CREATED, HTTP_409_CONFLICT
from utils.jwt import create_access_token
from utils.authorization import require_roles


# this file for librarin routers or shared with admin only
from slowapi.util import get_remote_address
from slowapi import Limiter



router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)
limiter = Limiter(key_func=get_remote_address)
## TODO: Implement user update and veiw profile



@router.get("/opt/counter")
@limiter.limit("5/minute")
def user_counter(request:Request,db:Session = Depends(get_db)):
    counter = db.query(modules.Users).count()
    return {"total_users": counter}
