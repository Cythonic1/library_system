from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status, Request
from .jwt import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")


# upon secssus this will return the current loged in User
# or it will return an error
# used as Dependence injection to make the
# route validation easier
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload  # returns dict with 'sub' and 'role'



# here is checking the user role from the givn array
# whither it in the allowed list or not
def require_roles(*allowed_roles):
    def role_checker(user=Depends(get_current_user)):

        if user['role'] not in allowed_roles:
            raise HTTPException(status_code=403, detail="Access forbidden")
        return user
    return role_checker
