from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from os import getenv
from fastapi.responses import JSONResponse
from pymongo import MongoClient, errors
from routes import router as list_router


# Load environment variables
MONGO_URI = getenv("MONGODB_CONNECTION_URI", 'localhost')
MONGO_DB = getenv("DB_NAME", 'default')
MONGO_USER = getenv("DB_USER", '')
MONGO_PW = getenv("DB_PW")
mongo_connection_string = f"mongodb://{MONGO_USER}:{MONGO_PW}@{MONGO_URI}"

app = FastAPI()
app.include_router(list_router, tags=["list"], prefix="/list")
app.debug = True

origins = ["*"]  # Change this to restrict origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UnprocessableEntity(HTTPException):
    def __init__(self, detail=None, headers=None):
        super().__init__(status_code=422, detail=detail, headers=headers)

# Custom exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc):
    print(exc)
    error_messages = []
    for error in exc.errors():
        error_messages.append({"field": error["loc"][0], "message": error["msg"]})
    
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": error_messages},
    )

@app.get("/")
async def root():
    return {'message': 'Welcome to PyMongo'}


@app.on_event("startup")
def startup_db_client():
    try:
        print(mongo_connection_string)
        app.mongodb_client = MongoClient(mongo_connection_string)
        app.database = app.mongodb_client[MONGO_DB]
        app.database.command('ping')
    except errors.ConnectionFailure as e:
        # Handle the exception here, e.g. log the error or display a user-friendly message
        print(f"Failed to connect to MongoDB: {e}")
        # Optionally, raise the exception again to propagate it to the caller
        raise e

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()