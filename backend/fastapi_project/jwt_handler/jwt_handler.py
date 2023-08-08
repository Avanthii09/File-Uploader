#this file is responsible for signing,encoding and decoding and returning JWTs
import time
import jwt


JWT_SECRET ="secret"
JWT_ALGORITHM = "HS256"
#function that returns generated tokens
def token_response(token : str):
    return{
        "access token":token
        
    }
#function to sign jwt
def signJWT(userID : str):
    payload = {
        "userID" : userID,
        "exp" : time.time() + 600
    }
    token = jwt.encode(payload,JWT_SECRET,algorithm=JWT_ALGORITHM)
    return token_response(token)


def decodeJWT(token: str):
    try:
        decode_token = jwt.decode(token, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return decode_token if decode_token['exp'] >= time.time() else None
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
