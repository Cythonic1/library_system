from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status, Request
from .jwt import decode_access_token


def get_current_user(request: Request):
    token_cookie = request.cookies.get("access_token")
    if not token_cookie:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing access token cookie"
        )
    
    # If token in cookie contains "Bearer " prefix, remove it:
    if token_cookie.startswith("Bearer "):
        token = token_cookie[7:]
    else:
        token = token_cookie
    
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    return payload



# Role-based access control
def require_roles(*allowed_roles):
    def role_checker(user: dict = Depends(get_current_user)):
        if user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access forbidden"
            )
        return user
    return role_checker
