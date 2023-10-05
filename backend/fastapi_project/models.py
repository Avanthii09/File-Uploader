# from sqlalchemy import Boolean,Column,Integer,String,LargeBinary,LargeBinary
# from database import Base

# class User(Base):
#     __tablename__ = "users"
#     # id = Column(Integer, primary_key=True)
#     # emailID = Column(String(50))
#     # passwd = Column(String(20))
#     # role = Column(String(20))
#     # # order = Column(Integer)
#     # pdf_quart1 = Column(LargeBinary)
#     # pdf_quart2 = Column(LargeBinary)
#     # pdf_quart3 = Column(LargeBinary)
#     # pdf_quart4 = Column(LargeBinary)
#     emailID = Column(String(50),primary_key=True)
#     passwd = Column(String(20))
#     role = Column(String(20))
#     section = Column(String(50))
#     order = Column(Integer,primary_key=True)
#     quart1 = Column(LargeBinary(length=1000000))
#     quart2 = Column(LargeBinary(length=1000000))
#     quart3 = Column(LargeBinary(length=1000000))
#     quart4 = Column(LargeBinary(length=1000000))

    
    
    
from sqlalchemy import Boolean,Column,Integer,String,LargeBinary,LargeBinary,Date
from database import Base

class User(Base):
    __tablename__ = "users"
    emailID = Column(String(50),primary_key=True)
    passwd = Column(String(20))
    role = Column(String(20))
    section = Column(String(50))
    order = Column(Integer,nullable=False)
    quart1 = Column(LargeBinary(length=1000000))
    quart2 = Column(LargeBinary(length=1000000))
    quart3 = Column(LargeBinary(length=1000000))
    quart4 = Column(LargeBinary(length=1000000))
    
class Dates(Base):
    __tablename__ = "dates"
    quarter = Column(String(20),primary_key=True)   
    Enddate = Column(Date)