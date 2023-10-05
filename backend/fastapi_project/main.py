from fastapi import FastAPI, Body, Depends, HTTPException, File, UploadFile, Response
from schema.schema import LoginSchema
from schema.schema import userDetailsSchema, UserUpdate, timeextend
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
import PyPDF2
from sqlalchemy.exc import SQLAlchemyError
from starlette.responses import FileResponse
app = FastAPI()
import logging
logging.basicConfig(level=logging.DEBUG)
from typing import Annotated, List
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfgen import canvas
from datetime import datetime, timedelta
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from typing import Dict
import csv
import smtplib
import ssl
import time
from asyncio import sleep
from datetime import date 
import schedule


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

def check_user(data: LoginSchema):
    for user in admin_data:
        if user["email"] == data.email and user["password"] ==  data.password:
            return True
    return False
    
def set_user_email(user: LoginSchema):
    global user_email
    user_email=user.email

def get_user_email():
    if user_email:
        return user_email
    else:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
def get_current_active_user(user: userDetailsSchema = Depends(get_user_email)):
    if user.role == "active":
        return user
    else:   
        raise HTTPException(status_code=400, detail="User is not active")

def merge_pdfs(pdfs):
    merger = PyPDF2.PdfMerger()
    for pdf_data in pdfs:
        pdf_stream = BytesIO(pdf_data)
        pdf_reader = PyPDF2.PdfReader(pdf_stream)
        merger.append(pdf_reader)
    merged_stream = BytesIO()
    merger.write(merged_stream)
    return merged_stream.getvalue()

def user_to_dict(user: models.User):
    return {
        "email": user.emailID,
        "Section": user.section}
    


@app.post("/admin/login")
def admin_login(admin: LoginSchema):
    try:
        if admin.email == "adminPSG@gmail.com" and admin.password == "123":
            return {"access_token": sign_jwt({"email": admin.email, "role": "Admin"}), "role": "Admin"}
        else:
            raise HTTPException(status_code=401, detail="Invalid login credentials")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.post("/admin/enter_details", dependencies=[Depends(jwtBearer())], tags=["adminEnterdetails"])
def admin_enter_details(db: db_dependency, user: userDetailsSchema = Body(default=None)):
    try:
        if user is None:
            raise HTTPException(status_code=400, detail="User data not provided")
        
        # Check if the provided order value is already used
        existing_user_with_order = db.query(models.User).filter(models.User.order == user.order).first()
        if existing_user_with_order:
            print("hi")
            raise HTTPException(status_code=409, detail="User with the same order already exists")
        
        if db.query(models.User).filter(models.User.emailID == user.email).first():
            raise HTTPException(status_code=409, detail="User with the same ID already exists")

        db_user = models.User(
            emailID=user.email,
            passwd=user.password,
            role=user.role,
            section=user.section,
            order=user.order
        )
        db.add(db_user)
        db.commit()
        return {"message": "User details entered successfully"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))





# class CustomHTTPException(HTTPException):
#     def __init__(self, status_code: int, detail: str):
#         self.detail = {"message": detail}
#         super().__init__(status_code=status_code, detail=self.detail)

# @app.post("/admin/enter_details", dependencies=[Depends(jwtBearer())], tags=["adminEnterdetails"])
# def admin_enter_details(db: db_dependency, user: userDetailsSchema = Body(default=None)):
#     try:
#         if user is None:
#             raise CustomHTTPException(status_code=400, detail="User data not provided")
        
#         existing_user_with_order = db.query(models.User).filter(models.User.order == user.order).first()
#         if existing_user_with_order:
#             raise CustomHTTPException(status_code=409, detail="User with the same order already exists")
        
#         if db.query(models.User).filter(models.User.emailID == user.email).first():
#             raise CustomHTTPException(status_code=409, detail="User with the same ID already exists")

#         db_user = models.User(
#             emailID=user.email,
#             passwd=user.password,
#             role=user.role,
#             section=user.section,
#             order=user.order
#         )
#         db.add(db_user)
#         db.commit()
#         return {"message": "User details entered successfully"}
    
#     except CustomHTTPException as custom_exc:
#         db.rollback()
#         return {
#             "message": custom_exc.detail["message"]
#         }

    # except Exception as e:
    #     db.rollback()
    #     return {
    #         "message": str(e)
    #     }

# @app.post("/admin/enter_details", dependencies=[Depends(jwtBearer())], tags=["adminEnterdetails"])
# def admin_enter_details(db: db_dependency, user: userDetailsSchema = Body(default=None)):
#     try:
#         query = text("SELECT * FROM users WHERE emailID = :email")
#         result = db.execute(query, {"email": user.email}).fetchone()
        
#         if result:
#             stored_password = result[1]
#             stored_role = result[2]
            
#             if user.password == stored_password:
#                 set_user_email(user)
#                 return {
#                     "access_token": sign_jwt({"email": user.email, "role": stored_role}),
#                     "role": stored_role

#                 }
#             else:
#                 return {"message": "Invalid credentials"}
#         else:
#             return {"message": "User not found"}

#     except HTTPException as http_exc:
#         db.rollback()
#         raise http_exc  # Re-raise the exception with the original status code and detail

#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=500, detail="An internal server error occurred")

@app.post("/user/login", tags=["user login"])
def user_login(user: LoginSchema = Body(default=None), db: Session = Depends(get_db)):
    try:
        query = text("SELECT * FROM users WHERE emailID = :email")
        result = db.execute(query, {"email": user.email}).fetchone()
        
        if result:
            stored_password = result[1]
            stored_role = result[2]
            
            if user.password == stored_password:
                set_user_email(user)
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
    

@app.put("/user/upload_pdf/quarter1", dependencies=[Depends(jwtBearer())], tags=["upload pdf"])
async def upload_pdf(files: List[UploadFile] = File(...),user_email: str = Depends(get_user_email),db: Session = Depends(get_db),):
    try:
        for file in files:
            if file.content_type != "application/pdf":
                raise HTTPException(status_code=400,detail=f"Invalid file format for {file.filename}. Please upload a PDF.")
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
            db_user.quart1 = merged_pdf_data
            db.commit()
            return {"message": "PDF files merged and stored successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        logging.exception("An error occurred during PDF upload:")
        return {
            "error": "Internal Server Error",
            "detail": str(e),
        }

#user pdf upload - quarter 2    
@app.put("/user/upload_pdf/quarter2", dependencies=[Depends(jwtBearer())], tags=["upload pdf"])
async def upload_pdf(files: List[UploadFile] = File(...),user_email: str = Depends(get_user_email),db: Session = Depends(get_db),):
    try:
        for file in files:
            if file.content_type != "application/pdf":
                raise HTTPException(status_code=400,detail=f"Invalid file format for {file.filename}. Please upload a PDF.")
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
            db_user.quart2 = merged_pdf_data
            db.commit()
            return {"message": "PDF files merged and stored successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        logging.exception("An error occurred during PDF upload:")
        return {"error": "Internal Server Error","detail": str(e)}
    

#user pdf upload - quarter 3   
@app.put("/user/upload_pdf/quarter3", dependencies=[Depends(jwtBearer)], tags=["upload pdf"])
async def upload_pdf(files: List[UploadFile] = File(...),user_email: str = Depends(get_user_email),db: Session = Depends(get_db),):
    try:
        for file in files:
            if file.content_type != "application/pdf":
                raise HTTPException(status_code=400,detail=f"Invalid file format for {file.filename}. Please upload a PDF.")
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
            db_user.quart3 = merged_pdf_data
            db.commit()
            return {"message": "PDF files merged and stored successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")

    except Exception as e:
        logging.exception("An error occurred during PDF upload:")
        return {"error": "Internal Server Error","detail": str(e),}   
    
#user pdf upload - quarter 4  
@app.put("/user/upload_pdf/quarter4", dependencies=[Depends(jwtBearer())], tags=["upload pdf"])
async def upload_pdf(files: List[UploadFile] = File(...),user_email: str = Depends(get_user_email),db: Session = Depends(get_db),):
    try:
        for file in files:
            if file.content_type != "application/pdf":
                raise HTTPException(status_code=400,detail=f"Invalid file format for {file.filename}. Please upload a PDF.")
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
            db_user.quart4 = merged_pdf_data
            db.commit()
            return {"message": "PDF files merged and stored successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")

    except Exception as e:
        logging.exception("An error occurred during PDF upload:")
        return {"error": "Internal Server Error","detail": str(e)}
    
   
def create_index_pdf(quarter,subtitle,db: Session = Depends(get_db)):
    buffer = BytesIO()    
    c = canvas.Canvas(buffer, pagesize=letter)
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    title_style = styles["Title"] 
    subtitle_style = styles["Normal"]  
    title = f"PSG COLLEGE OF TECHNOLOGY - COIMBATORE - 4 "
    if(quarter=="quart1"):
           section_names = db.query(models.User.section).filter(models.User.quart1 != None).order_by(models.User.order).all()
    if(quarter=="quart2"):
       section_names = db.query(models.User.section).filter(models.User.quart2 != None).order_by(models.User.order).all()
    if(quarter=="quart3"):
       section_names = db.query(models.User.section).filter(models.User.quart3 != None).order_by(models.User.order).all()
    if(quarter=="quart4"):
       section_names = db.query(models.User.section).filter(models.User.quart4 != None).order_by(models.User.order).all()
    y_position = 750
    left_margin = 100 
    box_padding = 10
    box_width = 400
    box_height = 500
    box_center_x = 300
    box_center_y = y_position - (box_height / 2)
    title_width = c.stringWidth(title, "Helvetica-Bold", 14)
    title_x = box_center_x - (title_width / 2)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(title_x, y_position - 20, title)
    y_position -= 40  
    subtitle = subtitle
    subtitle_width = c.stringWidth(subtitle, "Helvetica-Bold", 13)
    subtitle_x = box_center_x - (subtitle_width / 2)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(subtitle_x, y_position, subtitle)
    y_position -= 40  
    subtitle = "INDEX"
    subtitle_width = c.stringWidth(subtitle, "Helvetica-Bold", 14)
    subtitle_x = box_center_x - (subtitle_width / 2)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(subtitle_x, y_position, subtitle)
    y_position -= 40  
    subtitle = "List of users"
    subtitle_width = c.stringWidth(subtitle, "Helvetica-Bold", 14)
    subtitle_x = box_center_x - (subtitle_width / 2)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(subtitle_x, y_position, subtitle)
    y_position -= 40  
    section_font_size = 12  
    for index, (section_name,) in enumerate(section_names, start=1):
        text = f"{index}.   {section_name}"
        text_width = c.stringWidth(text, "Helvetica", section_font_size)
        x_position = left_margin  
        c.setFont("Helvetica", section_font_size)
        c.drawString(x_position, y_position, text)
        y_position -= 20 
    
    c.save()
    buffer.seek(0)
    return buffer.read()

         
def merge_pdfs_with_index(pdfs, index_pdf):
    merger = PdfMerger()
    merged_stream = BytesIO()
    merger.append(BytesIO(index_pdf))
    for pdf_data in pdfs:
        pdf_stream = BytesIO(pdf_data)
        merger.append(pdf_stream)
    merger.write(merged_stream)
    merger.close()
    return merged_stream.getvalue()


#principal download pdf - quarter 1
@app.get("/principal/download_pdf/quarter1", dependencies=[Depends(jwtBearer())],tags=["principal download pdf"])
async def fetch_merged_pdf_quarter1(db: Session = Depends(get_db)):
    try:
        pdfs_rows_quarter1 = db.query(models.User.quart1).order_by(models.User.order).all()
        pdfs_quarter1 = [row.quart1 for row in pdfs_rows_quarter1 if row.quart1]
        if pdfs_quarter1: 
            current_year = datetime.now().year
            subtitle= f"January {current_year} to March {current_year}"         
            index_pdf = create_index_pdf("quart1",subtitle,db)
            merged_pdf = merge_pdfs_with_index(pdfs_quarter1,index_pdf)
            temp_file_path = "quarter1_merged_pdf.pdf"
            with open(temp_file_path, "wb") as temp_file:
                temp_file.write(merged_pdf)
            return FileResponse(temp_file_path, filename="quarter1_merged_pdf.pdf")
        else:
            raise HTTPException(status_code=404, detail="No PDFs found for Quarter 1")
    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

#principal download pdf - quarter 2
@app.get("/principal/download_pdf/quarter2",dependencies=[Depends(jwtBearer())], tags=["principal download pdf"])
async def fetch_merged_pdf_quarter2(db: Session = Depends(get_db)):
    try:
        pdfs_rows_quarter2 = db.query(models.User.quart2).order_by(models.User.order).all()
        pdfs_quarter2 = [row.quart2 for row in pdfs_rows_quarter2 if row.quart2]
        if pdfs_quarter2:
            current_year = datetime.now().year
            subtitle= f"April {current_year} to June {current_year}" 
            index_pdf = create_index_pdf("quart2",subtitle,db)
            merged_pdf = merge_pdfs_with_index(pdfs_quarter2, index_pdf)
            temp_file_path = "quarter2_merged_pdf.pdf"
            with open(temp_file_path, "wb") as temp_file:
                temp_file.write(merged_pdf)
            return FileResponse(temp_file_path, filename="quarter2_merged_pdf.pdf")
        else:
            raise HTTPException(status_code=404, detail="No PDFs found for Quarter 2")
    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

#principal download pdf - quarter 3
@app.get("/principal/download_pdf/quarter3",dependencies=[Depends(jwtBearer())], tags=["principal download pdf"])
async def fetch_merged_pdf_quarter3(db: Session = Depends(get_db)):
    temp_file_path=None
    try:
        pdfs_rows_quarter3 = db.query(models.User.quart3).order_by(models.User.order).all()
        pdfs_quarter3 = [row.quart3 for row in pdfs_rows_quarter3 if row.quart3]
        if pdfs_quarter3:
            current_year = datetime.now().year
            subtitle= f"July {current_year} to September {current_year}" 
            index_pdf = create_index_pdf("quart3",subtitle,db)
            merged_pdf = merge_pdfs_with_index(pdfs_quarter3, index_pdf)
            temp_file_path = "quarter3_merged_pdf.pdf"
            with open(temp_file_path, "wb") as temp_file:
                temp_file.write(merged_pdf)
            return FileResponse(temp_file_path, filename="quarter3_merged_pdf.pdf")
        else:
            raise HTTPException(status_code=404, detail="No PDFs found for Quarter 3")
    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail="Internal Server Error")


#principal download pdf - quarter 4
@app.get("/principal/download_pdf/quarter4",dependencies=[Depends(jwtBearer())], tags=["principal download pdf"])
async def fetch_merged_pdf_quarter4(db: Session = Depends(get_db)):
    try:
        pdfs_rows_quarter4 = db.query(models.User.quart4).order_by(models.User.order).all()
        pdfs_quarter4 = [row.quart4 for row in pdfs_rows_quarter4 if row.quart4]
        if pdfs_quarter4:
            current_year = datetime.now().year
            subtitle= f"October {current_year} to December {current_year}" 
            index_pdf = create_index_pdf("quart4",subtitle,db)
            merged_pdf = merge_pdfs_with_index(pdfs_quarter4, index_pdf)
            temp_file_path = "quarter4_merged_pdf.pdf"
            with open(temp_file_path, "wb") as temp_file:
                temp_file.write(merged_pdf)
            return FileResponse(temp_file_path, filename="quarter4_merged_pdf.pdf")
        else:
            raise HTTPException(status_code=404, detail="No PDFs found for Quarter 4")
    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail="Internal Server Error")

# unuploaded users - quarter 1
@app.get("/unuploaded_users/quarter1")
async def unuploaded_users(db: Session = Depends(get_db)):     
    users = db.query(models.User).filter(models.User.quart1.is_(None)).all()
    if not users:
        return Response(content="All users have uploaded", status_code=200)
    return [user_to_dict(user) for user in users]

# unuploaded users - quarter 2
@app.get("/unuploaded_users/quarter2")
async def unuploaded_users(db: Session = Depends(get_db)):
    users = db.query(models.User).filter(models.User.quart2.is_(None)).all()
    if not users:
        return Response(content="All users have uploaded", status_code=200)
    return [user_to_dict(user) for user in users]


# unuploaded users - quarter 3
@app.get("/unuploaded_users/quarter3")
async def unuploaded_users(db: Session = Depends(get_db)):
    users = db.query(models.User).filter(models.User.quart3.is_(None)).all()
    if not users:
        return Response(content="All users have uploaded", status_code=200)
    return [user_to_dict(user) for user in users]


# unuploaded users - quarter 4
@app.get("/unuploaded_users/quarter4")
async def unuploaded_users(db: Session = Depends(get_db)):
    users = db.query(models.User).filter(models.User.quart4.is_(None)).all()
    if not users:
        return Response(content="All users have uploaded", status_code=200)
    return [user_to_dict(user) for user in users]


@app.get("/display_users")
async def display_users(db: Session = Depends(get_db)):
    try:
        users_details = db.query(models.User.emailID,models.User.role,models.User.section, models.User.order).order_by(models.User.order).all()
        users_list = []
        for email_id,role,section,order in users_details:
            user_data = {"emailID": email_id,"role":role,"section":section,"order": order}
            users_list.append(user_data)
        if users_list:
           return users_list
        else:
           return {"message": "No users found"}
 
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.put("/update_users")
async def update_user_details(update_data: List[UserUpdate], db: Session = Depends(get_db)):
    try:
        for item in update_data:
            user = db.query(models.User).filter(models.User.emailID == item.emailID).first()
            if user:
                user.order = item.order
                db.commit()
            else:
                raise HTTPException(status_code=404, detail=f"User not found: {item.emailID}")
        return {"message": "User details updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")




#Time extension
@app.put("/timeextension")
async def update_date(date_data: timeextend, db: Session = Depends(get_db)):
      try:
        db_date = db.query(models.Dates).filter(models.Dates.quarter == date_data.quarter).first()
        if db_date :
             db_date.Enddate = date_data.endDate   
             db.commit()
             return {"message": "Time extended succesfully"}
        else:
            raise HTTPException(status_code=404, detail="Date not found")          
      except Exception as e:
        db.rollback()
        print("Error:", e) 
        raise HTTPException(status_code=500, detail="Internal Server Error")
      

#Fetch end date 
@app.get("/fetchEnddate/{quarter_name}")
async def fetch_end_date(quarter_name: str, db: Session = Depends(get_db)):
    try:
        details = db.query(models.Dates).filter(models.Dates.quarter == quarter_name).first()        
        if details:
            end_date = details.Enddate
            return {"enddate": end_date}
        else:
            raise HTTPException(status_code=404, detail="Quarter not found")    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

