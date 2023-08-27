from typing import Optional
import uuid
from pydantic import BaseModel, Field


class DocModel(BaseModel):
    filename: str
    contents: Optional[bytes | None] = None


class TodoModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: Optional[str] = None
    description: str
    timestamp: str
    document: Optional[DocModel] = None
    filename: Optional[str] = None
    done: Optional[bool] = False
    


class TodoUpdateModel(BaseModel):
    title: Optional[str]
    description: Optional[str]
    document: Optional[DocModel] = None
    filename: Optional[str] = None
    done: Optional[bool] = False


class TodoReturnModel(BaseModel):
    id: str
    timestamp: str
    title: Optional[str]
    description: Optional[str]
    filename: Optional[str] = None
    done: Optional[bool] = False
    