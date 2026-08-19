import jwt
import datetime
import uuid
import bcrypt
from fastapi import APIRouter, Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.storage.database import database
from app.config import settings

auth_router = APIRouter()
security = HTTPBearer()

SECRET_KEY = settings.JWT_SECRET_KEY
TOKEN_EXPIRE_DAYS = settings.JWT_ACCESS_TOKEN_EXPIRE_DAYS

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    
    # Handle the hardcoded guest session
    if token == "guest-token-123" and settings.ENABLE_GUEST_LOGIN:
        user_id = "usr-demo-1"
        try:
            from app.utils.seed_guest import seed_guest_if_needed
            seed_guest_if_needed(user_id)
        except Exception as e:
            print(f"Error seeding guest: {e}")
        return user_id

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
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )
    except Exception:
        return False


def create_token(user_id: str) -> str:
    return jwt.encode(
        {
            "sub": user_id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=TOKEN_EXPIRE_DAYS),
        },
        SECRET_KEY,
        algorithm="HS256",
    )

@auth_router.post("/register")
def register(request: AuthRequest):
    email = request.email.strip().lower()
    cursor = database.connection.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    hashed_pw = hash_password(request.password)
    now = datetime.datetime.utcnow().isoformat()
    
    cursor.execute(
        "INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
        (user_id, email, hashed_pw, now)
    )
    database.connection.commit()
    
    token = create_token(user_id)
    return {"token": token, "user": {"id": user_id, "email": email}}

@auth_router.post("/login")
def login(request: AuthRequest):
    email = request.email.strip().lower()
    cursor = database.connection.cursor()
    cursor.execute("SELECT id, password_hash FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    if not row or not verify_password(request.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = row["id"]
    token = create_token(user_id)
    return {"token": token, "user": {"id": user_id, "email": email}}
