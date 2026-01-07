from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt

from app.core.config import SECRET_KEY, ALGORITHM

security = HTTPBearer()

def require_role(allowed_roles: list):
    def role_checker(credentials=Depends(security)):
        token = credentials.credentials
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except jwt.JWTError:
             raise HTTPException(status_code=401, detail="Invalid or expired token")

        if payload.get("role") not in allowed_roles:
            raise HTTPException(status_code=403, detail="Access denied")

        return payload

    return role_checker
