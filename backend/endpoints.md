


# Authentication:

/api/signup

## Take 
class SignUpRequest(BaseModel):
    username: str
    password: str
    email: EmailStr


return :

just statue code 201

---

/api/login

## Take

class LoginRequest(BaseModel):
    username: str
    password: str

return 
    return {"access_token": access_token, "token_type": "bearer"}


---

/api/admin/users/add_users

## Take

class SignUpRequestAdmin(BaseModel):
    username: str
    password: str
    email: EmailStr
    role: RoleEnum


return 
200

---

/api/admin/users

## take nothing

return 

class UserOutAdmin(BaseModel):
    user_id: int
    username: str
    email: str
    role: RoleEnum
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True


---


put /api/admin/{user_id}


## Take

class UpdateUserRequestAdmin(BaseModel):
    username: Optional[str]
    email: Optional[str]
    role: Optional[str]

## return 
    return {"msg": "User updated successfully", "user": user_db}


---

/api/admin

@router.delete("/users/{user_id}")


## take user_id


return 
return {"msg": "User deleted successfully"}

---



/api/books/ [GET]
Take
None (Requires roles: admin, librarian, user)

Return
List of books (all records from the database)

---


/api/books/{book_id} [DELETE]
Take
Path parameter: book_id (int)

Return
{"detail": "Book deleted successfully"}

or

HTTP 404 if book not found


---
/api/books/{book_id} [PUT]
Take
Path parameter: book_id (int)

JSON body: schema.BookUpdate

Return
Updated book object (BookOut schema)

or

HTTP 404 if book not found
HTTP 304 if no changes provided


---

/api/books/{book_id} [GET]
Take
Path parameter: book_id (int)

Return
Book object (BookOut schema)

or

HTTP 404 if book not found



---

/api/books/create [POST]
Take
JSON body: schema.BookCreate

Return
Newly created book object (BookOut schema)



---
/api/books/borrowed/{book_id} [PUT]
Take
Path parameter: book_id (int)

Return
Updated book object after borrowing (BookOut schema)

or

HTTP 404 if book not found
HTTP 409 if not enough books available
