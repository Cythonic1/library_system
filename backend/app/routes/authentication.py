import smtplib
from typing_extensions import List
from utils.authorization import require_roles
from fastapi.routing import APIRoute, APIRouter,Response,Request
from sqlalchemy.orm.session import Session
import schema
from database import get_db
from fastapi import HTTPException, Depends
from utils.validation import userRoleEnumMapping, verify_password, hash_password, validate_password_strength
import modules
from starlette.status import HTTP_200_OK,HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_201_CREATED, HTTP_409_CONFLICT
from utils.jwt import create_access_token
import time
import secrets
from dotenv import load_dotenv
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
load_dotenv()
router = APIRouter(
    prefix="/api",
    tags=["auth"]
)
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))  # Default to 587
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
otp_store = {}  # we can use Redis 

MAX_RETRIES = 3


# Here allowing user to sigeup the endpoint accepts
# json format data and the input should match
# the schema SignUpRequest. As showen below
# def signup(request: Request, user: schema.SignUpRequest, db: Session = Depends(get_db)):

@router.post("/signup", status_code=HTTP_201_CREATED)
def signup(request: Request,user: schema.SignUpRequest, db: Session = Depends(get_db)):
    print(user)
    


    # not nessary but checking if the username is bigger than 5 chars
    if len(user.username) < 6 :
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="username should be 6 char min")
    
    # fetch  data from the database
    user_db = db.query(modules.Users).filter(modules.Users.username == user.username).first()

    # check if the username alredy exist
    if user_db is not None :
        raise HTTPException(status_code=HTTP_409_CONFLICT, detail="Username already exists")

    # checking if the password used is strong or not
    validate_password_strength(user.password)

    # hashing the user password
    user.password = hash_password(user.password)

    # mapping the role. READ THE COMMENT ABOVE THE FUNCTION TO UNDERSTAND
    role = schema.RoleEnum.user

    # Creating new user object
    user_new = modules.Users(
        **user.dict(exclude={"role"}),  # exclude role from Pydantic dict
        role=role
    )
    
    
    

    # adding the user to the database and commit the changes
    db.add(user_new)
    db.commit()
    db.refresh(user_new)


@router.post("/login")
def login(
    request: Request, 
    user: schema.LoginRequest,
    db: Session = Depends(get_db),
):

    db_user = db.query(modules.Users).filter(modules.Users.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    
    return generate_and_send_otp(db_user.email, db_user.user_id, db_user.username)



def generate_otp(digit: int = 6) -> str:
    if not isinstance(digit, int) or digit < 1:
        raise ValueError("The number of digits must be a positive integer.")

    upper_bound = 10 ** digit 
    otp = str(secrets.randbelow(upper_bound)).zfill(digit)
    return otp


def send_email(to_email: str, subject: str, body: str, is_html: bool = False):

    try:
        # Create the email
        msg = MIMEMultipart()
        msg["From"] = SMTP_USERNAME
        msg["To"] = to_email
        msg["Subject"] = subject

        # Attach the body of the email
        if is_html:
            msg.attach(MIMEText(body, "html"))  # Use "html" subtype for HTML content
        else:
            msg.attach(MIMEText(body, "plain"))  # Use "plain" subtype for plain text

        # Connect to the SMTP server
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Upgrade the connection to secure
            server.login(SMTP_USERNAME, SMTP_PASSWORD)  # Log in to the SMTP server
            server.sendmail(SMTP_USERNAME, to_email, msg.as_string())  # Send the email

        return {"message": "Email sent successfully!"}
    except Exception as e:
        print(e)
        raise HTTPException(
            detail=f"Failed to send email: {str(e)}"
        )

@router.post("/verify-otp", status_code=HTTP_200_OK)
def verify_otp(otp_data: schema.VerifyOTP, response: Response, db: Session = Depends(get_db)):
    email = otp_data.email
    otp = otp_data.otp

    if email not in otp_store:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="OTP not found or expired"
        )

    stored_otp = otp_store[email]["otp"]
    expires_at = otp_store[email]["expires_at"]

    if time.time() > expires_at:
        del otp_store[email]
        raise HTTPException(
                            status_code=HTTP_400_BAD_REQUEST,
            detail="OTP expired"
        )

    if "retry_count" in otp_store[email] and otp_store[email]["retry_count"] >= MAX_RETRIES:
        del otp_store[email]
        raise HTTPException(
                status_code=HTTP_400_BAD_REQUEST,
            detail="Too many failed attempts. Please request a new OTP."
        )

    if otp != stored_otp:
        otp_store[email]["retry_count"] += 1
        raise HTTPException(
                            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid OTP. You have {MAX_RETRIES - otp_store[email]['retry_count']} attempts remaining."
        )

    # Get user info from otp_store
    user_id = otp_store[email]["user_id"]
    username = otp_store[email]["username"]
    
    # Fetch the user from database to get the role
    db_user = db.query(modules.Users).filter(modules.Users.user_id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Create token with user data
    token_data = {
        "sub": username,
        "role": db_user.role.value,
        "user_id": user_id
    }
    access_token = create_access_token(token_data)
    
    # Set cookie with token
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=False,  # Enable in production (requires HTTPS)
        max_age=7600,  # 1 hour expiration (adjust as needed)
        path="/",
    )
    
    del otp_store[email]
    return {
        "message": "OTP verified successfully!", 
        "access_token": access_token,
        "role": db_user.role.value
    }

def generate_and_send_otp(email: str, user_id: int, username: str):
    if email in otp_store and time.time() < otp_store[email]["expires_at"]:
        return {"message": "An OTP has already been sent. Please check your email."}

    otp = generate_otp(6)
    expiration_time = time.time() + 60
    otp_store[email] = {
        "otp": otp,
        "expires_at": expiration_time,
        "retry_count": 0,
        "user_id": user_id,
        "username": username
    }
    html_body = f"""
    <html>
      <body>
        <h1>Welcome to Our Website </h1>
        <p>Here is your OTP code:</p>
        <p style="font-size: 24px; color: #007BFF;"><strong>{otp}</strong></p>
        <p>This OTP will expire in 60 seconds.</p>
        <p>If you did not request this, please ignore this email.</p>
      </body>
    </html>
    """
    send_email(email, "Your OTP Code", html_body, is_html=True)
    return {"message": "OTP sent successfully!","email":email}
@router.get("/session", response_model=List[schema.UserInfo])
def get_current_user_role(user=Depends(require_roles("admin", "librarian", "user")), db:Session = Depends(get_db)):
    current_user = db.query(modules.Users).filter(modules.Users.user_id == user["user_id"]).first()

    return [current_user]
