from fastapi import FastAPI, Body, Depends, HTTPException, File, UploadFile
from schema.schema import adminLoginSchema, UserLoginSchema
from schema.schema import UserDetailsSchema
from jwt_handler.jwt_handler import signJWT
from jwt_bearer import jwtBearer
from database import engine, SessionLocal
import models
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel
import time
import jwt
import os
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from tempfile import NamedTemporaryFile
from PyPDF2 import PdfMerger
from sqlalchemy.exc import SQLAlchemyError
from starlette.responses import FileResponse
app = FastAPI()
import logging
logging.basicConfig(level=logging.DEBUG)
from typing import Annotated, List

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "secret")

origins = [
    "http://localhost:3000",  # Add your frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def sign_jwt(data: dict):
    payload = {
        "exp": time.time() + 3600,  # Token expiration time (1 hour)
        **data,
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")

# class AdminLoginSchema(BaseModel):
#     email: str
#     password: str
    
# class UserLoginSchema(BaseModel):
#     email: str
#     password: str
#     role:str
    
# class userDetailsSchema(BaseModel):
#     id : int 
#     email : str
#     password : str 
#     role: str 
   

admin_data = {
    "email": "adminPSG@gmail.com",
    "password": "123"
}

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session,Depends(get_db)]

def check_user(data: UserLoginSchema):
    for user in admin_data:
        if user["email"] == data.email and user["password"] ==  data.password:
            return True
    return False
    
def set_user_email(user: UserLoginSchema):
    global user_email
    user_email=user.email

def get_user_email():
    if user_email:
        return user_email
    else:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
def get_current_active_user(user: UserDetailsSchema = Depends(get_user_email)):
    if user.role == "active":
        return user
    else:   
        raise HTTPException(status_code=400, detail="User is not active")


@app.post("/admin/login")
def admin_login(admin: adminLoginSchema):
    try:
        if admin.email == "adminPSG@gmail.com" and admin.password == "123":
            return {"access_token": sign_jwt({"email": admin.email, "role": "Admin"}), "role": "Admin"}
        else:
            raise HTTPException(status_code=401, detail="Invalid login credentials")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.post("/admin/enter_details", dependencies=[Depends(jwtBearer())], tags=["adminEnterdetails"])
def admin_enter_details(db: db_dependency, user: UserDetailsSchema = Body(default=None)):
    try:
        if user is None:
            raise HTTPException(status_code=400, detail="User data not provided")
        if db.query(models.User).filter(models.User.id == user.id).first():
            raise HTTPException(status_code=409, detail="User with the same ID already exists")

        db_user = models.User(
            id=user.id,
            emailID=user.email,
            passwd=user.password,
            role=user.role,
            # order=user.order
        )
        db.add(db_user)
        db.commit()
        return {"message": "User details entered successfully"}

    except Exception as e:
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail="An error occurred while processing the request")


@app.post("/user/login", tags=["user login"])
def user_login(user: UserLoginSchema = Body(default=None), db: Session = Depends(get_db)):
    try:
        query = text("SELECT * FROM users WHERE emailID = :email")
        result = db.execute(query, {"email": user.email}).fetchone()
        
        if result:
            stored_password = result[2]
            stored_role = result[3]
            
            if user.password == stored_password:
                return {
                    "access_token": sign_jwt({"email": user.email, "role": stored_role}),
                    "role": stored_role
                }
            else:
                return {"message": "Invalid credentials"}
        else:
            return {"message": "User not found"}
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the request")
    



@app.put("/user/upload_pdf", dependencies=[Depends(jwtBearer())], tags=["upload pdf"])
async def upload_pdf(
    files: List[UploadFile] = File(...),
    user_email: str = Depends(get_user_email),
    db: Session = Depends(get_db),
):
    try:
        for file in files:
            if file.content_type != "application/pdf":
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid file format for {file.filename}. Please upload a PDF.",
                )
                

        merger = PdfMerger()
        with NamedTemporaryFile(delete=False) as temp_file:
            temp_file_path = temp_file.name
            for file in files:
                pdf_data = await file.read()
                merger.append(BytesIO(pdf_data)) 
            merger.write(temp_file_path)

        with open(temp_file_path, "rb") as temp_file:
            merged_pdf_data = temp_file.read()
        os.remove(temp_file_path)
        db_user = db.query(models.User).filter(models.User.emailID == user_email).first()
        if db_user:
            db_user.pdf_quart3 = merged_pdf_data
            db.commit()
            return {"message": "PDF files merged and stored successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "PDF files merged and stored successfully"}


    except Exception as e:
        logging.exception("An error occurred during PDF upload:")
        return {
            "error": "Internal Server Error",
            "detail": str(e),
        }

@app.get("/principal/download_pdf", tags=["principal download pdf"])
async def fetch_merged_pdf_quarter1(db: Session = Depends(get_db)):
    try:
        pdfs_rows_quarter1 = db.query(models.User.pdf_quart1).all()
        pdfs_quarter1 = [row.pdf_quart1 for row in pdfs_rows_quarter1 if row.pdf_quart1]
        if pdfs_quarter1:
            merged_pdf_data = b"".join(pdfs_quarter1)
            temp_file_path = "quarter1_merged_pdf.pdf"
            with open(temp_file_path, "wb") as temp_file:
                temp_file.write(merged_pdf_data)

            return FileResponse(temp_file_path, filename="quarter1_merged_pdf.pdf")
        else:
            raise HTTPException(status_code=404, detail="No PDFs found for Quarter 1")

    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        return {
            "error": "Internal Server Error",
            "detail": str(e)
        }