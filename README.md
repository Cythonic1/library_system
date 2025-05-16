



# How to start the program
- make sure to read the database file to connect to the database
- every file is documented to avoid confusing

```bash
git clone https://github.com/Cythonic1/library_system.git

cd library_system/backend

# to creat virtual environment
python3 -m venv venv 

pip install -r requirements.txt

# run the program
fastapi dev app/app.py


```


## Application Over view.

The Application gonne be a library_system where users can borrow books and there is a libarains
and admin users.

### backend
- Implement authentication and authorization in the API (Fast API) ✅
- Implement CRUD endpoints for the books ✅
- endpoints to send notification to the user 
- endpoint to check the if the notification where access then check them 
- endpoint to view user current borrowed books and the deadline to return them. ✅
- endpoint to check if the user miss the return date then fee with present

### frontend
- book gallary where user can see the books and borrow them for certain time 
- login and signup pages.
- admin panel. (adding book, removing books, create users with privilage)
- libarains panel. (very similare to the admin panel but without user creation)



