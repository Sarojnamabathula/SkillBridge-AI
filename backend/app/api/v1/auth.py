import uuid
import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session

from app.schemas.auth import UserCreate, UserLogin, UserResponse, Token
from app.models.db_models import UserModel
from app.utils.db import get_db
from app.utils.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter()

@router.post("/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account."""
    existing = db.query(UserModel).filter(UserModel.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_id = str(uuid.uuid4())
    hashed_pwd = get_password_hash(user_in.password)
    now = datetime.datetime.now(datetime.timezone.utc)

    user = UserModel(
        id=user_id,
        email=user_in.email.lower(),
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        created_at=now
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": user.id, "email": user.email})
    
    user_res = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        created_at=user.created_at.isoformat()
    )

    return Token(access_token=token, user=user_res)


@router.post("/auth/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user login and return JWT token."""
    user = db.query(UserModel).filter(UserModel.email == credentials.email.lower()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token(data={"sub": user.id, "email": user.email})
    
    user_res = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        created_at=user.created_at.isoformat()
    )

    return Token(access_token=token, user=user_res)


@router.get("/auth/me", response_model=UserResponse)
def get_current_user_profile(current_user: UserModel = Depends(get_current_user)):
    """Get active authenticated user profile."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        created_at=current_user.created_at.isoformat()
    )
