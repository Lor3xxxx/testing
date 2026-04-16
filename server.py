from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_GEAR = [
    {
        "id": 1,
        "name": "Треккинговые палки Carbon-X",
        "category": "Палки",
        "price_per_day": 500,
        "rating": 4.9,
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuC_EOHBkfxurxpUyVccPQuokZDg5rw6LWpiHTCuwL6vQ5GQy5rw1OGUJcr0o0A0RHVASZnLip05Jq177B8W3UCAW6ZKxW9ctyP61mxtZuupWvuduZ7BnArQFbq921H7rtWY-x9fitFeCqt2ckfv361rBeD888lbq7h0VBEGDAc873_CTH3JXFdEdWRiXwe-Xhxn9TBCNGXdqGIrp0VlWRylAKQ93BxFCiVZoCXMIKFDHEs6bjOQtuPvQYTtoGRAqg2qtRStBdJ4jQ"
    },
    {
        "id": 2,
        "name": "Палатка Summit 2-Person",
        "category": "Палатки",
        "price_per_day": 1200,
        "rating": 5.0,
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCQYkd020CmaW0tAAPtNq_kCmUFXCtqYQCBwpXfAS3nLwn_fNC_dScv2wGu-Y-30TcBZ5yQtqUu-L-vpXGcpolaN7Ach5E8xMhZGvF92SuHBL-jHELiYGMrgKeY6fcdfM4QVrcA03OlfG0evVbAAoEQDq8uOu3ISu3QBIZDvkCqHWrjeqXYiva8VusFDaOeqYLCcgopk32sE8dY2AmAow-4KDDo4h5D9BXhSbrMHUHTd-rbl2h5r2lW8PxMQPI5zze9y0hWJ5mcqQ"
    },
    {
        "id": 3,
        "name": "Рюкзак Alpinist 65L Pro",
        "category": "Рюкзаки",
        "price_per_day": 850,
        "rating": 4.8,
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuApDTHrD44m1Vp4rEtoIiezcyXmHNjRDgKcT8wQXuzdPwVMp4K0JLNXLP9vkB_3HV2xi8qJ4A74gvcjRPs8EforJR-I_evwJaf45FQxWa6Nx6WdGsX1F411glzszUhT7rLfVMM_T4beZbm4OjYUQDwf8dmCkzF-Sr4DvOEVX6VcC_TSH3OZ2AX4QdD_RutIRO8bsrsnfOs1X-gtUydeyp2Mzb2jYo0fpOXIF7AupFI_Qz_oM-MEF26RfiIISWxNIlNKSQf4U9QzbA"
    },
    {
        "id": 4,
        "name": "Ботинки Scarpa Phantom",
        "category": "Обувь",
        "price_per_day": 1500,
        "rating": 4.7,
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCUMzczSdwI2bk96yWEqvqu-KS8NoBhMGig3JcXg52fM-3-GEKzGsvBWyQe7d5rAW6bdFS62XJIw_pnBiPdKEw0Ytq-euJy_HcqwyY0_O55WqUNs0xRREyW9IuZKR7fm3aKkXH9uL56N1V0LuTFIL0rJUmZuzF_Q2XdCsXpAnFnJtMIa2yIHwud7gQwCJgmcqXux__5WufrTnEipmFjjs3-2rrEOR4iwvs7M9shyiu6xIQJucswwZTmbLoLIpVHCIjBPlGSaGgqVw"
    },
    {
        "id": 5,
        "name": "Фонарь Petzl Swift RL",
        "category": "Фонари",
        "price_per_day": 300,
        "rating": 4.9,
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBH5iJ0asxzYZANtvFKyDRz4mtdpURE8phxpWYKNP3QCmJz0w-0TAhxZLH7x9EB-2-t-LxsbmM10w_DFG5dWJJjFyUvC6eJouWuuMIedfQRPKyqJZShun5_RzkHfiDquuFgOPc7MQ5ClNOH6P3FcO2NArXnQbaCzmLQ1wLvi6xvhdiUbc7v916oWTLSn68h7DHH0mGR8pn6hmp9qbnNqyreNkh8peUXN-1DC4gtgktnfQUk1oKr4l66iaCBLvFA3RsaJEtpsaa3Ag"
    },
    {
        "id": 6,
        "name": "Спальник Down -20C",
        "category": "Спальники",
        "price_per_day": 950,
        "rating": 5.0,
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDYspGKqudwjFD6286AW6dVZ-YX2ptZkQ_Up7E0IHRX3DOmPE5t4QZW_SoQ6UAqCvW83rjSs5ir3zLVmeiaKddvzyx3IFgtWbLHRBLjlgpDvBjZ5eWsYYojfiMGa7HH6U4O_RcS_7a1lJZCxMvWMoZpzt6tsycYUnzdt_v0wfAm8Roi1hwE7XA4pM7sojYGaGPMBmr74XH8cjtR3OB3re7G25yKt1shMm28AeysC4dw1erwB0c-4QqJlAIiELWpXnGz4SB2AdmazQ"
    }
]

class OrderCreate(BaseModel):
    user_id: str
    item_id: int
    start_date: str
    end_date: str
    total_price: int
    payment_method: str

class ReviewCreate(BaseModel):
    item_id: int
    user_id: str
    rating: int
    text: str

orders_db = []
reviews_db = [
    {
        "id": "mock-rev-1",
        "item_id": 1,
        "user_id": "test_user_123",
        "rating": 5,
        "text": "Отличные палки, прошли с ними 30 км, никаких нареканий!",
        "created_at": "2026-04-10T10:00:00"
    }
]

@app.post("/api/orders")
async def create_order(order: OrderCreate):
    new_order = order.model_dump()
    new_order["id"] = str(uuid.uuid4())
    new_order["status"] = "active"
    new_order["created_at"] = datetime.datetime.now().isoformat()
    orders_db.append(new_order)
    return new_order
    
@app.get("/api/orders")
async def get_orders(user_id: str = None):
    # Auto-update status for expired orders
    today = datetime.datetime.now().date()
    for order in orders_db:
        if order["status"] == "active":
            try:
                end_date_obj = datetime.datetime.strptime(order["end_date"], "%Y-%m-%d").date()
                if today > end_date_obj:
                    order["status"] = "completed"
            except Exception:
                pass
                
    if user_id:
        return [o for o in orders_db if o["user_id"] == user_id]
    return orders_db

@app.get("/api/gear")
async def get_gear(category: str = "Все", search: str = ""):
    filtered = MOCK_GEAR
    if category and category != "Все":
        filtered = [g for g in filtered if g["category"] == category]
    if search:
        filtered = [g for g in filtered if search.lower() in g["name"].lower()]
    return list(filtered)

@app.post("/api/reviews")
async def create_review(review: ReviewCreate):
    new_rev = review.model_dump()
    new_rev["id"] = str(uuid.uuid4())
    new_rev["created_at"] = datetime.datetime.now().isoformat()
    reviews_db.append(new_rev)
    return new_rev

@app.get("/api/reviews")
async def get_reviews(item_id: int = None, user_id: str = None):
    res = reviews_db
    if item_id is not None:
        res = [r for r in res if r["item_id"] == item_id]
    if user_id is not None:
        res = [r for r in res if r["user_id"] == user_id]
    return sorted(res, key=lambda x: x["created_at"], reverse=True)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
