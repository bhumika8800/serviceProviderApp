# Database Schema Documentation

This document describes the database collections (tables) and schemas designed for the ServiceProviderApp. The database uses **MongoDB** as the storage engine with **Mongoose** as the ODM (Object Document Mapper).

---

## 1. Embedded Sub-Schemas

These schemas are not stored as standalone collections; rather, they are embedded directly into parent documents to minimize join queries and optimize performance (the "one-to-few" embed pattern).

### Address Schema (`addressSchema`)
*Embedded in Users.*

| Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Generated | Unique identifier for the address |
| `label` | String | Default: `'home'` | E.g., 'home', 'work', 'other' |
| `line1` | String | Required | Street address line 1 |
| `line2` | String | Optional | Street address line 2 |
| `city` | String | Required | City |
| `state` | String | Required | State |
| `pincode` | String | Required | Postal PIN code |
| `country` | String | Default: `'India'` | Country |
| `latitude` | Number | Optional | Geolocational latitude |
| `longitude` | Number | Optional | Geolocational longitude |
| `is_default`| Boolean | Default: `false` | Marks default billing/shipping address |

### Cart Item Schema (`cartItemSchema`)
*Embedded in Users.*

| Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `service_id`| ObjectId | Ref: `'Service'`, Required | Reference to the selected service |
| `quantity` | Number | Default: `1`, Min: `1` | Quantity of services added |
| `added_at` | Date | Default: `Date.now` | Timestamp when added to cart |

---

## 2. Collections & Models

### A. Users Collection (`User`)

| Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `first_name` | String | Required, Trimmed | User's first name |
| `last_name` | String | Required, Trimmed | User's last name |
| `email` | String | Required, Unique, Lowercase, Trimmed | User's email |
| `phone` | String | Required | Contact number (string to support country codes & formatting) |
| `img_url` | String | Optional | Profile image URL (stored via Cloudinary) |
| `role` | String | Enum: `['customer', 'provider', 'admin']`, Default: `'customer'` | User security role |
| `addresses` | Array | Type: `[addressSchema]` | Embedded array of addresses |
| `cart_items`| Array | Type: `[cartItemSchema]` | Embedded array of cart items |
| `is_active` | Boolean | Default: `true` | Standard active status check |
| `created_at`| Date | Auto (Timestamps) | Profile creation timestamp |
| `updated_at`| Date | Auto (Timestamps) | Profile modification timestamp |

**Indexes:**
- `{ email: 1 }` (Unique)
- `{ phone: 1 }`

---

### B. Categories Collection (`Category`)

| Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `parent_id` | ObjectId | Ref: `'Category'`, Default: `null` | Multi-level category hierarchy (sub-categories) |
| `name` | String | Required, Unique | E.g., 'Plumbing', 'Cleaning' |
| `is_active` | Boolean | Default: `true` | Category status |

---

### C. Services Collection (`Service`)

| Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `category_id`| ObjectId | Ref: `'Category'`, Required | Reference to the service category |
| `name` | String | Required, Trimmed | Service title/name |
| `description`| String | Optional | Markdown or plain text description |
| `price` | Decimal128| Required | Precise price, avoiding IEEE float-rounding issues |
| `duration_mins`| Number| Optional | Expected duration of the service in minutes |
| `images` | Array | `[String]` | Array of Cloudinary image URLs |
| `tags` | Array | `[String]` | Tags for grouping and SEO |
| `avg_rating` | Number | Default: `0` | Cached rating updated via Review triggers |
| `review_count`| Number | Default: `0` | Cached count updated via Review triggers |
| `is_active` | Boolean | Default: `true` | Status of the service catalog item |
| `created_at`| Date | Auto (Timestamps) | Service creation timestamp |
| `updated_at`| Date | Auto (Timestamps) | Service modification timestamp |

**Indexes:**
- `{ category_id: 1 }`
- `{ tags: 1 }` (Multikey index)
- `{ name: 'text', description: 'text' }` (Full-text search index)

---

### D. Bookings Collection (`Booking`)

Uses the **Extended Reference Pattern**: copies specific details (price, name, address) at the time of purchase to preserve historical audit logs.

| Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | ObjectId | Ref: `'User'`, Required | Customer initiating the booking |
| `service_snapshot` | Object | Required | Snapshot of service details at booking time |
| `service_snapshot.service_id` | ObjectId | Ref: `'Service'`, Required | Reference to the original service catalog |
| `service_snapshot.name` | String | | Snapshot of the service name |
| `service_snapshot.price` | Decimal128 | | Snapshot of the service price |
| `address_snapshot` | Object | Required | Snapshot of the booking address |
| `address_snapshot.line1` | String | | Captured address line 1 |
| `address_snapshot.line2` | String | | Captured address line 2 |
| `address_snapshot.city` | String | | Captured city |
| `address_snapshot.state` | String | | Captured state |
| `address_snapshot.pincode`| String | | Captured pincode |
| `address_snapshot.country`| String | | Captured country |
| `address_snapshot.latitude`| Number | | Captured latitude |
| `address_snapshot.longitude`| Number | | Captured longitude |
| `booking_date` | Date | Required | Scheduled execution date and time |
| `total_amount` | Decimal128| Required | Final billed amount |
| `status` | String | Enum: `['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']`, Default: `'pending'` | Current status of the service job |
| `is_active` | Boolean | Default: `true` | Active status of the record |
| `created_at` | Date | Auto (Timestamps) | Order placement timestamp |
| `updated_at` | Date | Auto (Timestamps) | Order modification timestamp |

**Indexes:**
- `{ user_id: 1 }`
- `{ 'service_snapshot.service_id': 1 }`
- `{ booking_date: 1 }`
- `{ status: 1 }`

---

### E. Payments Collection (`Payment`)

Separated from Booking to preserve financial audit trail records.

| Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `booking_id` | ObjectId | Ref: `'Booking'`, Required | Target booking identifier |
| `payment_mode`| String | Enum: `['card', 'upi', 'netbanking', 'wallet', 'cash']`, Required | Mode of payment transaction |
| `transaction_id`| String | Optional | Gateway transaction ID (alphanumeric, e.g., from Razorpay) |
| `amount` | Decimal128| Required | Numeric amount processed |
| `status` | String | Enum: `['pending', 'successful', 'failed', 'refunded']`, Default: `'pending'` | Gateway callback state |
| `payment_date`| Date | Optional | Timestamp when payment completed |
| `created_at` | Date | Auto (Timestamps) | Transaction entry timestamp |

**Indexes:**
- `{ booking_id: 1 }`
- `{ transaction_id: 1 }`

---

### F. Notifications Collection (`Notification`)

| Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | ObjectId | Ref: `'User'`, Required | Recipient user |
| `type` | String | Enum: `['booking', 'payment', 'complaint', 'promotion', 'system']`, Required | Notification category |
| `title` | String | Required | Subject line or notification header |
| `message` | String | Required | Full body/text description |
| `reference_id`| ObjectId | Optional | ID pointing to related record (e.g., booking_id, payment_id) |
| `is_read` | Boolean | Default: `false` | Read status |
| `created_at` | Date | Auto (Timestamps) | Sent timestamp |

**Indexes:**
- `{ user_id: 1, is_read: 1, created_at: -1 }` (Compound query optimization)

---

### G. Complaints Collection (`Complaint`)

| Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `booking_id` | ObjectId | Ref: `'Booking'`, Required | Related order under dispute |
| `user_id` | ObjectId | Ref: `'User'`, Required | Direct customer reference |
| `title` | String | Required | Title/Subject of complaint |
| `description`| String | Optional | Detailed explanation of issue |
| `status` | String | Enum: `['open', 'in_progress', 'resolved', 'closed']`, Default: `'open'` | Resolution pipeline stage |
| `resolution_notes`| String | Optional | Internal response notes from support team |
| `is_active` | Boolean | Default: `true` | Record status |
| `resolved_at`| Date | Optional | Resolution date timestamp |
| `created_at` | Date | Auto (Timestamps) | Submission timestamp |

**Indexes:**
- `{ booking_id: 1 }`
- `{ user_id: 1 }`

---

## H. Reviews Collection (`Review`)

Separate from `Service` to prevent unbounded document growth (staying safely under MongoDB's 16MB document limit).

| Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `booking_id` | ObjectId | Ref: `'Booking'`, Required, Unique | Associated booking (one review per booking limit) |
| `user_id` | ObjectId | Ref: `'User'`, Required | Customer writing the review |
| `service_id` | ObjectId | Ref: `'Service'`, Required | Associated service catalog |
| `rating` | Number | Required, Min: `1`, Max: `5` | Integer star rating |
| `comment` | String | Optional | Written feedback |
| `created_at` | Date | Auto (Timestamps) | Review creation timestamp |

**Indexes:**
- `{ service_id: 1 }`

---

### I. Queries Collection (`Query`)

Contact-us form data pipeline.

| Field | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | ObjectId | Ref: `'User'`, Default: `null` | Optional associated logged-in user |
| `name` | String | Required | Submitter's full name |
| `email` | String | Required | Submitter's email address |
| `phone` | String | Optional | Submitter's phone number |
| `title` | String | Required | Title of query |
| `message` | String | Required | Full text inquiry message |
| `status` | String | Enum: `['open', 'closed']`, Default: `'open'` | Query triage status |
| `created_at` | Date | Auto (Timestamps) | Submission timestamp |

**Indexes:**
- `{ email: 1 }`

---

## 3. Core Architectural Patterns

1. **Extended Reference Pattern:** Applied to the `Booking` schema. We replicate the price, name, and service details inside the booking at the time of purchase. This prevents issues if a service's price changes or if the original service record is deleted in the future.
2. **"One-to-Few" Embed Pattern:** Standard address lists and shopping cart items are embedded inside the `User` document as sub-documents. This improves performance since these details are highly bound and read together.
3. **No Unbounded Arrays:** Reviews are kept as separate collection documents rather than embedded arrays in `Service` to prevent document bloat and ensure scalability.
4. **Caching / De-normalization:** `avg_rating` and `review_count` are cached on the `Service` model. They are updated when a Review is submitted or modified, allowing rapid catalog indexing and high-speed search without heavy aggregate functions.
