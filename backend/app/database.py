from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# !IMPORTANT
# Here you need to run postgresql localy and create an admin user
# and give him an access on the library database. Do not fogot to
# create that database
SQLALCHEMY_DATABASE_URL = 'postgresql://admin:password123@localhost:5432/library'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SesstionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()


def get_db():
    db = SesstionLocal()

    try:
        yield db
    finally:
        db.close()
