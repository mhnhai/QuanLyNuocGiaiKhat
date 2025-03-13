from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import customer, staff, product, supplier, order, importation, role_account, status_order, revenue, cost, payment_form, position, category, upload_product_image
    
origins =[
    "http://localhost:3000",
    "http://localhost:3001",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(product.router, prefix="/api")
app.include_router(customer.router, prefix="/api")
app.include_router(staff.router, prefix="/api")
app.include_router(supplier.router, prefix="/api")
app.include_router(order.router, prefix="/api")
app.include_router(importation.router, prefix="/api")
app.include_router(role_account.router, prefix="/api")
app.include_router(status_order.router, prefix="/api")
app.include_router(revenue.router, prefix="/api")
app.include_router(cost.router, prefix="/api")
app.include_router(payment_form.router, prefix="/api")
app.include_router(position.router, prefix="/api")
app.include_router(category.router, prefix="/api")
app.include_router(upload_product_image.router, prefix="/api")
@app.get("/")
def read_root():
    return {"Hello": "World"}
