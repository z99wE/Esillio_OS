import jwt
import logging
from fastapi import APIRouter, HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
from app.storage.supabase_client import supabase

auth_router = APIRouter()
security = HTTPBearer()

# For Supabase, the JWT_SECRET_KEY must be the JWT secret found in the Supabase Dashboard
SECRET_KEY = settings.JWT_SECRET_KEY

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    
    # Handle the hardcoded guest session for demo purposes
    if token == "guest-token-123" and settings.ENABLE_GUEST_LOGIN:
        user_id = "00000000-0000-4000-a000-000000000000" # Valid UUID for Postgres
        try:
            from app.utils.seed_guest import seed_guest_if_needed
            seed_guest_if_needed(user_id)
        except Exception as e:
            logging.error(f"Error seeding guest: {e}")
        return user_id

    try:
        # Try fast local validation if the secret is valid
        if SECRET_KEY and SECRET_KEY != "dev-only-change-me":
            payload = jwt.decode(
                token, 
                SECRET_KEY, 
                algorithms=["HS256"], 
                options={"verify_aud": False} 
            )
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid token payload: no subject")
            return user_id
        else:
            raise ValueError("No local secret")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except Exception:
        # Fallback: Server-side check with Supabase (handles ES256/RS256 and missing local secrets securely)
        if supabase:
            try:
                # The python client uses the token in the header or as a parameter
                response = supabase.auth.get_user(token)
                if response and response.user:
                    return response.user.id
            except Exception as supabase_err:
                logging.error(f"Supabase server-side token validation failed: {supabase_err}")
                
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def require_role(allowed_roles: list[str]):
    def role_checker(user_id: str = Depends(get_current_user)):
        if user_id == "00000000-0000-4000-a000-000000000000":
            role = "patient" # Guests are patients
        else:
            if not supabase:
                raise HTTPException(status_code=500, detail="Supabase not configured")
            
            try:
                res = supabase.table("profiles").select("role").eq("id", user_id).execute()
                if not res.data:
                    role = "patient"
                else:
                    role = res.data[0].get("role", "patient")
            except Exception as e:
                logging.error(f"Failed to fetch user role: {e}")
                role = "patient" # fallback
                
        if role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user_id
    return role_checker


# Note: /register and /login endpoints have been removed.
# In a frontend-first Supabase architecture, the frontend uses @supabase/supabase-js 
# to authenticate directly with Supabase Auth. The frontend then passes the access_token
# (JWT) in the Authorization header to this backend for verification.
