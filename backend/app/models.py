from pydantic import BaseModel, EmailStr

class User(BaseModel):
    email: EmailStr
    password: str

class UserInDB(User):
    hashed_password: str

class EmailData(BaseModel):
    sender: str
    subject: str
    timestamp: str
    attachments: list = []