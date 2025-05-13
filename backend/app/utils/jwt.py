from datetime import datetime, timedelta
from jose import JWTError, jwt

# this should be in an environment file
SECRET_KEY = "612dfadccea2055e427af5203763e0f98e7b4f3f28ea5706bc27c7f837e7f33b5bc33ae0e1cd936d67fbe0c910fb44c153ad4209665b05dfea09e75cdf63bc6cab1fa2c06893dd8ec453559d935563e9be3d3365475bc25a15d821da400d695ea2f203136f28d785ec99663f18ebb8c62fa5f53c8cbb49f2bc80aeaa7fd76bf0d6abe3158f2ced6887c6fa84b1cbcb61d373bf403078e2b80ee5a65209c84026b7080d95a0332f5c282d91edc4ea256b33811cf089371acf60190115ced44c6cbb389d73f345ab2ad4891308545c8633b9264da430c9b2804c5d44183a08f0d2d23588ecd7e38d74acdda1de9cd88c9811072004583af9a8f4c296888c7165c0"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120


# creating an access token that hold the role and exp time
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# decoding the jwt and return the decoded data
def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None
