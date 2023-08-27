from copy import copy
import io
from fastapi import APIRouter, Body, Form, Request, Response, HTTPException, status, File, UploadFile
from fastapi.encoders import jsonable_encoder
from typing import List

from fastapi.responses import StreamingResponse

from models import TodoModel, TodoUpdateModel, DocModel, TodoReturnModel

router = APIRouter()

@router.post("/", response_description='create a todo item', status_code=status.HTTP_201_CREATED,response_model=TodoModel)
def create_item(
    request: Request, 
    todo: TodoModel = Body(...)):
    """
    Create a new todo item.

    Args:
        request (Request): A Request object that represents the incoming HTTP request.
        todo (TodoModel): A TodoModel object that contains the details of the todo item to be created.

    Returns:
        TodoModel: The created todo item as the HTTP response.
    """
    todo = jsonable_encoder(todo)
    new_todo_item = request.app.database["lists"].insert_one(todo)
    created_todo_item = request.app.database["lists"].find_one({
        "_id": new_todo_item.inserted_id
    })

    return created_todo_item


@router.post("/file", response_description="Create list with file")
def create_list_with_attachement(
    request: Request, 
    title: str = Form(...), 
    description: str = Form(...), 
    timestamp: str = Form(...), 
    file: UploadFile = File(...)
):
    """
    Create a new list item with an attached file.

    Args:
        request (Request): The FastAPI Request object.
        title (str): The title of the list item (required).
        description (str): The description of the list item (required).
        timestamp (str): The timestamp of the list item (required).
        file (UploadFile): The uploaded file (required).

    Returns:
        ListModel: The created list item with the attached file.

    Raises:
        Exception: If there was an error uploading the file.
    """
    try:
        contents = file.file.read()
        doc = DocModel(filename=file.filename, contents=contents)
        todo = TodoModel(title=title, description=description, timestamp=timestamp, document=doc.model_dump())
        request.app.database["lists"].insert_one(todo.model_dump())
        if todo.document.contents: 
            todo.document.contents = None
        return todo
    except Exception as e:
        print(e)
        return {"message": "There was an error uploading the file"}

    

@router.get("/", response_description="list all the todos", response_model=List[TodoModel])
def show_list(request: Request):
    """
    Retrieves a list of todos from a database and returns them as a response.

    Args:
        request (Request): The incoming HTTP request object.

    Returns:
        List[dict]: List of todos, where each todo is represented as a dictionary with the following fields:
            - id (str): The unique identifier of the todo.
            - title (str): The title of the todo.
            - description (str): The description of the todo.
            - filename (str): The filename of the associated document, if any.
            - document (dict): A subdocument containing the filename and contents of the associated document, if any.
            - timestamp (str): The timestamp of the todo.
            - done (bool): A boolean indicating whether the todo is done or not.
    """
    pipeline = [
        {
            "$project": {
                "id": 1,  # Exclude the _id field
                "title": 1,
                "description": 1,
                "filename": "$document.filename",  # Extract the filename field from the document subdocument
                "document": {
                    "$cond": {
                        "if": "$document",
                        "then": {
                            "filename": "$document.filename",
                            "contents": ""
                        },
                        "else": "$$REMOVE"  # Exclude the field if it's null
                    },
                },
                "timestamp": 1,
                "done": 1
            }
        },
        {
            "$limit": 50
        }
    ]
    todos = list(request.app.database["lists"].aggregate(pipeline))
    return todos


@router.get("/file/{id}", response_description="Create list with file")
def get_attachement(
    request: Request, 
    id: str):
    """
    Retrieve a file attachment for a todo item.

    Args:
        request (Request): The FastAPI Request object.
        id (str): The ID of the todo item.

    Returns:
        StreamingResponse: A StreamingResponse object with the file contents as a stream.

    Raises:
        HTTPException: If the file is not found or missing contents.
    """
    try:
        document = request.app.database["lists"].find_one({"id": id})
        print(document)
        if document and document["document"] and "contents" in document["document"]:
            filename = document["document"]["filename"]
            contents = document["document"]["contents"]
            return StreamingResponse(io.BytesIO(contents), media_type="application/octet-stream", headers={"Content-Disposition": f"attachment; filename={filename}"})
        else:
            return {"message": "File not found or missing contents"}
    except Exception as e:
        print(e)
        return {"message": "Error downloading the file"}


@router.delete("/",response_description="delete a item from list")
def delete_list(
    id: str, request: Request, 
    response: Response):
    """
    Delete a Todo item.

    Args:
        id (str): The ID of the Todo item.
        request (Request): The FastAPI Request object.
        response (Response): The FastAPI Response object.

    Returns:
        Response: A Response object with status code 204 (No Content).

    Raises:
        HTTPException: If the Todo item is not found.
    """
    delete_result = request.app.database["lists"].delete_one({"id": id})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail = f"Item with {id} not found")


@router.put("/", response_description="Update the item in the list", response_model=TodoModel)
def update_item(
    id: str,
    remove_file: bool,
    request: Request,
    todo: TodoUpdateModel = Body(...),
) -> TodoReturnModel:
    """
    Update an item in the list.

    Args:
        id (str): The ID of the item to be updated.
        remove_file (bool): A flag indicating whether to remove a file.
        request (Request): The request object.
        todo (TodoUpdateModel): The updated data for the item.

    Returns:
        ListReturnModel: The updated item in the list.

    Raises:
        HTTPException: If the item with the provided ID is not found or has not been modified.
    """
    existing_list_item = request.app.database["lists"].find_one({"id": id})
    if not existing_list_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"ListItem with ID {id} not found")

    update_data = TodoModel(**existing_list_item)
    if todo.title and todo.title != existing_list_item["title"]:
        update_data.title = todo.title
    if todo.description and todo.description != existing_list_item["description"]:
        update_data.description = todo.description
    if todo.done != existing_list_item["done"]:
        update_data.done = todo.done
    if todo.document is not None and todo.document.contents is not None and todo.document.contents != b"":
        update_data.document = todo.document
    else:
        if remove_file:
            update_data.document = None
        else:
            update_data.document = existing_list_item.get("document")
    if todo.filename is not None:
        update_data.filename = todo.filename
    else:
        if remove_file:
            update_data.filename = None
        else:
            update_data.filename = existing_list_item.get("filename")

    update_result = request.app.database["lists"].update_one({"id": id}, {"$set": update_data.model_dump()})
    print("update result ", update_result.modified_count)

    if update_result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED, detail=f"Item with ID {id} has not been modified")

    return_data = copy(TodoReturnModel(**update_data.model_dump()))
    return return_data
