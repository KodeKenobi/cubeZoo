from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
import uuid

from config import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES
ALGORITHM = "HS256"

app = FastAPI(title="Blog Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

users_db = {}
posts_db = {}
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    is_admin: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PostCreate(BaseModel):
    title: str
    content: str

class PostResponse(BaseModel):
    id: str
    title: str
    content: str
    publication_date: datetime
    owner_id: str
    author_email: str

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = users_db.get(user_id)
    if user is None:
        raise credentials_exception
    return user

@app.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    for existing_user in users_db.values():
        if existing_user["email"] == user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    is_first_user = len(users_db) == 0
    users_db[user_id] = {
        "id": user_id,
        "email": user.email,
        "hashed_password": hashed_password,
        "is_admin": is_first_user
    }
    return UserResponse(id=user_id, email=user.email, is_admin=is_first_user)

@app.post("/token", response_model=Token)
async def login(user_credentials: UserLogin):
    user = None
    for u in users_db.values():
        if u["email"] == user_credentials.email:
            user = u
            break
    
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return UserResponse(id=current_user["id"], email=current_user["email"], is_admin=current_user.get("is_admin", False))

@app.get("/users/", response_model=List[UserResponse])
async def get_users(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")
    return [UserResponse(id=u["id"], email=u["email"], is_admin=u.get("is_admin", False)) for u in users_db.values()]

@app.post("/posts/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreate, current_user: dict = Depends(get_current_user)):
    post_id = str(uuid.uuid4())
    publication_date = datetime.utcnow()
    
    posts_db[post_id] = {
        "id": post_id,
        "title": post.title,
        "content": post.content,
        "publication_date": publication_date,
        "owner_id": current_user["id"]
    }
    
    return PostResponse(
        id=post_id,
        title=post.title,
        content=post.content,
        publication_date=publication_date,
        owner_id=current_user["id"],
        author_email=current_user["email"]
    )

@app.get("/posts/", response_model=List[PostResponse])
async def get_posts():
    posts = []
    for post in posts_db.values():
        author_email = users_db[post["owner_id"]]["email"]
        posts.append(PostResponse(
            id=post["id"],
            title=post["title"],
            content=post["content"],
            publication_date=post["publication_date"],
            owner_id=post["owner_id"],
            author_email=author_email
        ))
    return posts

@app.get("/posts/{post_id}", response_model=PostResponse)
async def get_post(post_id: str):
    if post_id not in posts_db:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post = posts_db[post_id]
    author_email = users_db[post["owner_id"]]["email"]
    
    return PostResponse(
        id=post["id"],
        title=post["title"],
        content=post["content"],
        publication_date=post["publication_date"],
        owner_id=post["owner_id"],
        author_email=author_email
    )

@app.put("/posts/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str, 
    post_update: PostUpdate, 
    current_user: dict = Depends(get_current_user)
):
    if post_id not in posts_db:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post = posts_db[post_id]
    
    if post["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")
    
    if post_update.title is not None:
        post["title"] = post_update.title
    if post_update.content is not None:
        post["content"] = post_update.content
    
    author_email = users_db[post["owner_id"]]["email"]
    
    return PostResponse(
        id=post["id"],
        title=post["title"],
        content=post["content"],
        publication_date=post["publication_date"],
        owner_id=post["owner_id"],
        author_email=author_email
    )

@app.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: str, current_user: dict = Depends(get_current_user)):
    if post_id not in posts_db:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post = posts_db[post_id]
    
    if post["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    del posts_db[post_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 