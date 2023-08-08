from sqlalchemy import Boolean,Column,Integer,String,LargeBinary,LargeBinary
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    emailID = Column(String(50))
    passwd = Column(String(20))
    role = Column(String(20))
    # order = Column(Integer)
    pdf_quart1 = Column(LargeBinary)
    pdf_quart2 = Column(LargeBinary)
    pdf_quart3 = Column(LargeBinary)
    pdf_quart4 = Column(LargeBinary)
    
    
    