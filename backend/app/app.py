from fastapi import FastAPI, Request
from sqlalchemy.orm.session import Session
from utils.authorization import get_current_user, require_roles
import modules
from database import get_db, engine
import schema
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_201_CREATED, HTTP_409_CONFLICT
from routes.authentication import router as auth_router
from routes.admin import router as admin_roure
from routes.books import  router as books_routes
from routes.user import  router as user_routes
from routes.notifications import router as notifications_router
from fastapi.middleware.cors import CORSMiddleware

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded



app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  # Explicitly allow JWT headers
)



# the will generate the table from the modules file
# if you want to create table put it in the module file as
# the require format
modules.Base.metadata.create_all(engine)

@app.get("/")
# Limit to 5 requests per minute per IP
@limiter.limit("5/minute")
async def welcome(request: Request):
    return {"message": "Welcome to my API!"}

# including the routers from the other files
app.include_router(auth_router)
app.include_router(admin_roure)
app.include_router(books_routes)
app.include_router(user_routes)
app.include_router(notifications_router)
