from pydantic import BaseModel , Field, EmailStr

class PostSchema(BaseModel):
    id : int = Field(default=None)
    title : str = Field(default=None)
    content : str = Field(default=None)
    
class adminLoginSchema(BaseModel):
    email : EmailStr = Field(default=None)
    password : str = Field(default=None)

class UserDetailsSchema(BaseModel):
    id : int = Field()
    email : EmailStr = Field()
    password : str = Field()
    role: str = Field()
   
class UserLoginSchema(BaseModel):
    email : EmailStr = Field()
    password : str = Field()
    # role:str = Field()
   