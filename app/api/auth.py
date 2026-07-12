import jwt
import datetime
import uuid
import hashlib
from fastapi import APIRouter, Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.storage.database import database

auth_router = APIRouter()
security = HTTPBearer()

SECRET_KEY = "esillio_local_secret_hackathon"

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return user_id
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {str(e)}")

class AuthRequest(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@auth_router.post("/register")
def register(request: AuthRequest):
    cursor = database.connection.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (request.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    hashed_pw = hash_password(request.password)
    now = datetime.datetime.utcnow().isoformat()
    
    cursor.execute(
        "INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
        (user_id, request.email, hashed_pw, now)
    )
    database.connection.commit()
    
    token = jwt.encode({"sub": user_id, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)}, SECRET_KEY, algorithm="HS256")
    return {"token": token, "user": {"id": user_id, "email": request.email}}

@auth_router.post("/login")
def login(request: AuthRequest):
    cursor = database.connection.cursor()
    cursor.execute("SELECT id, password_hash FROM users WHERE email = ?", (request.email,))
    row = cursor.fetchone()
    if not row or row["password_hash"] != hash_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = row["id"]
    token = jwt.encode({"sub": user_id, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)}, SECRET_KEY, algorithm="HS256")
    return {"token": token, "user": {"id": user_id, "email": request.email}}
