from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.utils.security import verify_token
from app.utils.exceptions import AuthenticationError
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Authentication middleware to validate JWT token and get current user.
    """
    try:
        # Extract token from credentials
        token = credentials.credentials

        # Verify and decode token
        payload = verify_token(token)
        if payload is None:
            raise AuthenticationError("Invalid token")

        # Extract email from token payload
        email: str = payload.get("sub")
        if email is None:
            raise AuthenticationError("Invalid token payload")

        # Find user in database
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise AuthenticationError("User not found")

        # Check if user is active
        if not user.is_active:
            raise AuthenticationError("Account is disabled")

        return user

    except AuthenticationError:
        raise
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise AuthenticationError("Token validation failed")
