# from pydantic import BaseModel , Field, EmailStr

# class adminLoginSchema(BaseModel):
#     email : EmailStr = Field(default=None)
#     password : str = Field(default=None)

# class UserDetailsSchema(BaseModel):
#     email : EmailStr = Field()
#     password : str = Field()
#     role : str = Field()
#     section : str = Field()
#     order : int = Field()
   
# class UserLoginSchema(BaseModel):
#     email : EmailStr = Field()
#     password : str = Field()
   

# class UserUpdate(BaseModel):
#     emailID: EmailStr = Field()
#     order: int = Field()
    
    
from pydantic import BaseModel , Field, EmailStr
from datetime import date

class userDetailsSchema(BaseModel):
    email : EmailStr = Field()
    password : str = Field()
    role : str = Field()
    section : str = Field()
    order : int = Field()
   
class LoginSchema(BaseModel):
    email : EmailStr = Field()
    password : str = Field()

class UserUpdate(BaseModel):
    emailID: EmailStr = Field()
    order: int = Field()

class timeextend(BaseModel):
    quarter: str = Field()
    endDate: date = Field()