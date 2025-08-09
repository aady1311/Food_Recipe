from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models import User
from app.schemas import UserSignUp, UserSignIn, UserResponse, Token
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.utils.exceptions import AuthenticationError, DuplicateError
from datetime import timedelta
from app.database import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def sign_up(user_data: UserSignUp, db: Session = Depends(get_db)):
    """
    Create a new user account.
    
    - **name**: User's full name (2-100 characters)
    - **email**: Valid email address (must be unique)
    - **password**: Password (min 8 chars, must contain letters and numbers)
    """
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise DuplicateError("Email already registered")
        
        # Hash the password
        hashed_password = get_password_hash(user_data.password)
        
        # Create new user
        new_user = User(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hashed_password
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": new_user.email}, 
            expires_delta=access_token_expires
        )
        
        logger.info(f"New user created: {new_user.email}")
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_minutes * 60,
            user=UserResponse.from_orm(new_user)
        )
        
    except IntegrityError:
        db.rollback()
        raise DuplicateError("Email already registered")
    except Exception as e:
        db.rollback()
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred during signup"
        )

@router.post("/signin", response_model=Token)
async def sign_in(user_credentials: UserSignIn, db: Session = Depends(get_db)):
    """
    Authenticate user and return access token.
    
    - **email**: User's registered email address
    - **password**: User's password
    """
    try:
        # Find user by email
        user = db.query(User).filter(User.email == user_credentials.email).first()
        
        if not user:
            raise AuthenticationError("Invalid email or password")
        
        # Verify password
        if not verify_password(user_credentials.password, user.hashed_password):
            raise AuthenticationError("Invalid email or password")
        
        # Check if user is active
        if not user.is_active:
            raise AuthenticationError("Account is disabled")
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": user.email}, 
            expires_delta=access_token_expires
        )
        
        logger.info(f"User signed in: {user.email}")
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_minutes * 60,
            user=UserResponse.from_orm(user)
        )
        
    except AuthenticationError:
        raise
    except Exception as e:
        logger.error(f"Signin error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred during signin"
        )
