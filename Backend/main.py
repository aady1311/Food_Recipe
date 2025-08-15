from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# Request model for POST
class Item(BaseModel):
    name: str
    price: float

# GET endpoint
@router.get("/hello")
async def say_hello():
    return {"message": "Hello, world!"}

# POST endpoint
@router.post("/items")
async def create_item(item: Item):
    return {"message": "Item received", "item": item}