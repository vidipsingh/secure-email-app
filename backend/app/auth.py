from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from bcrypt import hashpw, gensalt, checkpw
from dotenv import load_dotenv
import os

load_dotenv()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def hash_password(password: str) -> str:
    return hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Add proper JWT token verification here in production
    return token