from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from .auth import hash_password, verify_password, get_current_user
from .email_service import get_emails, get_attachment
from .database import users_collection
from .models import User
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
async def register(user: User):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    users_collection.insert_one({"email": user.email, "hashed_password": hashed_password})
    return {"message": "User registered successfully"}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": form_data.username, "token_type": "bearer"}

@app.get("/emails")
async def list_emails(current_user: str = Depends(get_current_user)):
    return get_emails()

@app.get("/download/{message_id}/{attachment_id}")
async def download_attachment(message_id: str, attachment_id: str, current_user: str = Depends(get_current_user)):
    return {"data": get_attachment(message_id, attachment_id)}