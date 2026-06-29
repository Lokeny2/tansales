# Database Schema Design (MongoDB Atlas)

## 1. Users Collection (`users`)
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password_hash": "string",
  "role": "string (enum: ['customer', 'admin'], default: 'customer')",
  "created_at": "date"
}

## 2. Products Collection (`products`)
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "base_price": "number",
  "category": "string",
  "is_active": "boolean",
  "variants": [
    {
      "sku": "string (unique)",
      "size": "string (S, M, L, XL)",
      "color": "string",
      "stock_quantity": "number",
      "image_urls": ["string"]
    }
  ],
  "created_at": "date"
}

## 3. Orders Collection (`orders`)
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (ref: 'users', nullable for guest)",
  "status": "string (enum: ['pending', 'paid', 'shipped', 'cancelled'])",
  "total_amount": "number",
  "shipping_details": {
    "full_name": "string",
    "street": "string",
    "city": "string"
  },
  "items": [
    {
      "product_id": "ObjectId",
      "sku": "string",
      "name": "string",
      "size": "string",
      "color": "string",
      "quantity": "number",
      "price_at_purchase": "number"
    }
  ],
  "created_at": "date"
}