# Helpdesk Backend API

Backend application for DITSINTEK Helpdesk system. Built with Express.js, PostgreSQL, and integrated with Gemini AI embeddings for semantic FAQ search.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/clunckyboy/helpdesk-ditsintek-backend.git
cd helpdesk-ditsintek-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
HOST=localhost

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/helpdesk_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_TOKEN_EXPIRATION=3h
REFRESH_TOKEN_EXPIRATION=7d

# Gemini API (for FAQ embeddings)
GEMINI_API_KEY=your_gemini_api_key

# CORS
CORS_ORIGIN=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### Running the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run database migrations
npm run migrate
```

The server will start at `http://localhost:3000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format

All responses follow this standard format:

```json
{
  "code": 200,
  "status": "success",
  "message": "Operation description",
  "data": {}
}
```

**Status codes:**
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## 🔐 Authentication

### Login (POST)

Generate access and refresh tokens for staff and admin users.

```http
POST /api/authentications
Content-Type: application/json

{
  "username": "johndoe",
  "password": "johndoe123"
}
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Authentication berhasil ditambahkan",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Refresh Token (PUT)

Generate a new access token when the current one expires.

```http
PUT /api/authentications
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Access Token berhasil diperbarui",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Logout (DELETE)

Invalidate refresh and access tokens. **Important:** Also remove tokens from browser storage (LocalStorage/Cookies) on the client side.

```http
DELETE /api/authentications
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Refresh Token berhasil dihapus"
}
```

---

## 👥 User Management

### Add User (POST)

Create a new helpdesk user.

```http
POST /api/users
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "name": "Jane Doe",
  "username": "janedoe",
  "password": "janedoe123",
  "role": "helpdesk"
}
```

**Response (201):**
```json
{
  "code": 201,
  "status": "success",
  "message": "User berhasil ditambahkan",
  "data": {
    "id": "Hzz48RE1952DK7QC"
  }
}
```

### Get All Users (GET)

Retrieve all users from the database.

```http
GET /api/users
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Users berhasil diambil",
  "data": [
    {
      "id_user": "vlBzv9rRVufhHy7G",
      "name": "John Doe",
      "username": "johndoe",
      "password": "$2b$10$pSj3AJupJiAWMcGQaDtTSeD7Ix0w7VtcFlmkh69b3QRlkuIDkVuHW",
      "role": "agent"
    },
    {
      "id_user": "Hzz48RE1952DK7QC",
      "name": "Jane Doe",
      "username": "janedoe",
      "password": "$2b$10$cqVRfryZTGfdMNszJaiwA.kq4/AbyZyCtTcFLoPnVvLbCY5ecwA2q",
      "role": "helpdesk"
    }
  ]
}
```

### Get User by ID (GET)

Retrieve a specific user by ID.

```http
GET /api/users/{id}
Authorization: Bearer {accessToken}
```

**Example:**
```http
GET /api/users/vlBzv9rRVufhHy7G
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "User berhasil diambil",
  "data": {
    "id_user": "vlBzv9rRVufhHy7G",
    "name": "John Doe",
    "username": "johndoe",
    "password": "$2b$10$pSj3AJupJiAWMcGQaDtTSeD7Ix0w7VtcFlmkh69b3QRlkuIDkVuHW",
    "role": "agent"
  }
}
```

### Update User (PUT)

Update user data by ID.

```http
PUT /api/users/{id}
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "password": "newpassword123"
}
```

**Example:**
```http
PUT /api/users/vlBzv9rRVufhHy7G
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "User berhasil diupdate",
  "data": {
    "id_user": "vlBzv9rRVufhHy7G"
  }
}
```

### Delete User (DELETE)

Remove a user from the system.

```http
DELETE /api/users/{id}
Authorization: Bearer {accessToken}
```

**Example:**
```http
DELETE /api/users/vlBzv9rRVufhHy7G
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "User berhasil dihapus",
  "data": {
    "id_user": "vlBzv9rRVufhHy7G"
  }
}
```

---

## 🎫 Ticketing System

### Get All Tickets (GET)

Retrieve all support tickets with optional filtering.

```http
GET /api/tickets?status=open&category=jaringan
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `status` - Filter by status (open, in_progress, resolved)
- `category` - Filter by category (jaringan, akun, hardware, etc.)

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Tickets berhasil diambil",
  "data": [
    {
      "id_ticket": "3ITzDM38tDGCAfxH",
      "telegram_chat_id": "123456",
      "reporter": "Budi",
      "reporter_role": "mahasiswa",
      "nim_nip": "20240001",
      "description": "Jaringan internet mati",
      "status": "open",
      "category": "jaringan",
      "assigned_to": null,
      "created_at": "2026-07-23T03:34:58.749Z",
      "updated_at": "2026-07-23T03:34:58.749Z",
      "assigned_to_name": "admin bejo"
    }
  ]
}
```

### Get Ticket Details (GET)

Retrieve a specific ticket with related messages.

```http
GET /api/tickets/{id}
Authorization: Bearer {accessToken}
```

**Example:**
```http
GET /api/tickets/3ITzDM38tDGCAfxH
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Ticket berhasil diambil",
  "data": {
    "id_ticket": "3ITzDM38tDGCAfxH",
    "telegram_chat_id": "123456",
    "reporter": "Budi",
    "reporter_role": "mahasiswa",
    "nim_nip": "20240001",
    "description": "Jaringan internet mati",
    "status": "in_progress",
    "category": "jaringan",
    "assigned_to": "GZ9lrd66JOTNsDN_",
    "created_at": "2026-07-23T03:34:58.749Z",
    "updated_at": "2026-07-23T03:42:49.841Z",
    "assigned_to_name": "admin bejo"
  }
}
```

### Update Ticket Status (PUT)

Change ticket status and assign to a staff member.

```http
PUT /api/tickets/{id}/status
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "status": "in_progress",
  "assigned_to": "GZ9lrd66JOTNsDN_"
}
```

**Example:**
```http
PUT /api/tickets/3ITzDM38tDGCAfxH/status
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Ticket berhasil diupdate",
  "data": {
    "id_ticket": "3ITzDM38tDGCAfxH"
  }
}
```

---

## 💬 Live Chat & Messaging

### Send Message (POST)

Helpdesk staff sends a message to a ticket reporter.

```http
POST /api/tickets/{id}/messages
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "id_user": "GZ9lrd66JOTNsDN_",
  "sender_type": "helpdesk",
  "message_text": "Halo, kami dari tim Helpdesk. Laporan Anda mengenai jaringan Wi-Fi sedang kami periksa. Mohon ditunggu ya."
}
```

**Example:**
```http
POST /api/tickets/adzZ6W5mwPMH6xXp/messages
```

**Response (201):**
```json
{
  "code": 201,
  "status": "success",
  "message": "Pesan berhasil dibuat",
  "data": {
    "id_message": "2HL9ksAu19lsFVEP"
  }
}
```

### Get Ticket Messages (GET)

Retrieve all messages for a specific ticket.

```http
GET /api/tickets/{id}/messages
Authorization: Bearer {accessToken}
```

**Example:**
```http
GET /api/tickets/adzZ6W5mwPMH6xXp/messages
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Pesan berhasil diambil",
  "data": [
    {
      "id_message": "3WPyjtuTJf0qdU4U",
      "id_ticket": "adzZ6W5mwPMH6xXp",
      "id_user": null,
      "sender_type": "mahasiswa",
      "message_text": "tidak bisa masuk akun",
      "created_at": "2026-07-24T08:32:58.236Z"
    },
    {
      "id_message": "2HL9ksAu19lsFVEP",
      "id_ticket": "adzZ6W5mwPMH6xXp",
      "id_user": "GZ9lrd66JOTNsDN_",
      "sender_type": "helpdesk",
      "message_text": "Halo, kami dari tim Helpdesk. Laporan Anda mengenai jaringan Wi-Fi sedang kami periksa. Mohon ditunggu ya.",
      "created_at": "2026-07-27T06:18:34.155Z"
    }
  ]
}
```

---

## 📝 Internal Notes

### Create Note (POST)

Create an internal note for a specific ticket.

```http
POST /api/tickets/{id}/notes
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "id_user": "oawjd821hHmdssn",
  "note_text": "Siswa ini sudah mengundurkan diri dari USU"
}
```

**Example:**
```http
POST /api/tickets/TKT-00000004/notes
```

**Response (201):**
```json
{
  "code": 201,
  "status": "success",
  "message": "Catatan berhasil dibuat",
  "data": {
    "id_note": "c0nLwYvkkOeaXRfz"
  }
}
```

### Get Ticket Notes (GET)

Retrieve all internal notes for a specific ticket.

```http
GET /api/tickets/{id}/notes
Authorization: Bearer {accessToken}
```

**Example:**
```http
GET /api/tickets/TKT-00000004/notes
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "Catatan berhasil diambil",
  "data": [
    {
      "id_note": "c0nLwYvkkOeaXRfz",
      "id_ticket": "TKT-00000004",
      "id_user": "oawjd821hHmdssn",
      "note_text": "Siswa ini sudah mengundurkan diri dari USU",
      "created_at": "2026-07-30T06:02:04.158Z"
    }
  ]
}
```

---

## 🤖 FAQ & Knowledge Base (AI Vector Search)

### Create FAQ (POST)

Create a new FAQ entry with AI embeddings for semantic search.

```http
POST /api/faqs
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "question": "Bagaimana reset password?",
  "answer": "Gunakan menu forgot password.",
  "category": "akun"
}
```

**Response (201):**
```json
{
  "code": 201,
  "status": "success",
  "message": "FAQ berhasil ditambahkan",
  "data": {
    "id_faq": "pqr7Oz8Ux4pZDzFh",
    "question": "Bagaimana reset password?",
    "answer": "Gunakan menu forgot password.",
    "category": "akun",
    "embeddings": [0.0123, -0.0456, 0.0789]
  }
}
```

### Update FAQ (PUT)

Update an existing FAQ entry. Embeddings are automatically regenerated.

```http
PUT /api/faqs/{id}
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "question": "Bagaimana cara reset password?",
  "answer": "Klik menu forgot password lalu ikuti instruksi email.",
  "category": "akun"
}
```

**Example:**
```http
PUT /api/faqs/pqr7Oz8Ux4pZDzFh
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "FAQ berhasil diupdate",
  "data": {
    "id_faq": "pqr7Oz8Ux4pZDzFh",
    "question": "Bagaimana cara reset password?",
    "answer": "Klik menu forgot password lalu ikuti instruksi email.",
    "category": "akun",
    "embeddings": [0.0123, -0.0456, 0.0789]
  }
}
```

### Delete FAQ (DELETE)

Remove an FAQ entry.

```http
DELETE /api/faqs/{id}
Authorization: Bearer {accessToken}
```

**Example:**
```http
DELETE /api/faqs/pqr7Oz8Ux4pZDzFh
```

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "FAQ berhasil dihapus",
  "data": {
    "id_faq": "pqr7Oz8Ux4pZDzFh",
    "question": "Bagaimana cara reset password?",
    "answer": "Klik menu forgot password lalu ikuti instruksi email.",
    "category": "akun",
    "embeddings": [0.0123, -0.0456, 0.0789]
  }
}
```

**Response (404):**
```json
{
  "code": 404,
  "status": "fail",
  "message": "FAQ tidak ditemukan"
}
```

### Search FAQ (GET)

Perform semantic search on FAQ database using AI embeddings.

```http
GET /api/faqs/search?query=jaringan
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `query` (required) - Search term for semantic matching

**Response (200):**
```json
{
  "code": 200,
  "status": "success",
  "message": "FAQ berhasil ditemukan",
  "data": [
    {
      "id_faq": "pqr7Oz8Ux4pZDzFh",
      "question": "Bagaimana reset password?",
      "answer": "Gunakan menu forgot password.",
      "category": "akun"
    }
  ]
}
```

### FAQ Implementation Notes

- Embeddings are generated from combined `question` and `answer` text
- AI model used: `models/embedding-001` from Gemini
- PostgreSQL column type: `vector(768)` for embeddings
- HNSW index is used for efficient vector similarity search
- Embeddings are automatically regenerated when FAQ is updated
- Search uses vector similarity matching for semantic relevance

---

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Database:** PostgreSQL with pgvector extension
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **AI Integration:** Gemini API for embeddings
- **Real-time:** Socket.io
- **Validation:** Joi
- **ID Generation:** nanoid
- **Migration:** node-pg-migrate

---

## 📁 Project Structure

```
helpdesk-ditsintek-backend/
├── src/
│   ├── index.js              # Application entry point
│   ├── server/               # Server configuration
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic layer
│   ├── middlewares/          # Express middleware
│   ├── exceptions/           # Custom error handling
│   ├── security/             # JWT and authentication
│   └── utils/                # Utility functions
├── migrations/               # Database migrations
├── package.json              # Dependencies
├── .env.example              # Environment template
└── README.md                 # This file
```

---

## 🔒 Security Features

- JWT-based authentication with access and refresh tokens
- Password hashing using bcrypt (cost factor: 10)
- CORS protection
- Request validation with Joi schemas
- Environment variable management
- Token expiration handling
- Refresh token rotation support

---

## 📖 Client Implementation Examples

### JavaScript (Fetch API)

**Delete FAQ:**
```javascript
async function deleteFaq(idFaq) {
  const response = await fetch(`/api/faqs/${idFaq}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Gagal menghapus FAQ');
  }
  return result.data;
}
```

### JavaScript (Axios)

**Delete FAQ:**
```javascript
import axios from 'axios';

async function deleteFaq(idFaq) {
  const { data } = await axios.delete(`/api/faqs/${idFaq}`);
  return data.data;
}
```

**Update state after deletion:**
```javascript
setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id_faq !== idFaq));
```

### UX Recommendations

- Show confirmation dialog before delete operations
- Disable delete button during request to prevent double-clicking
- Display toast/snackbar message on successful deletion
- Handle 404 responses by refreshing the list (item may be deleted in another session)
- Implement optimistic UI updates for better user experience

---

## 🚀 Deployment

The application is configured for deployment on Vercel. Key features:

- Serverless function export in `src/index.js`
- Environment variable support via Vercel dashboard
- Database migrations can be run before deployment

### Pre-deployment Checklist

- [ ] Database migrations executed
- [ ] Environment variables configured
- [ ] JWT secrets set securely
- [ ] Gemini API key valid
- [ ] CORS origins configured
- [ ] Database backups created

---

## 📝 Database Migrations

View and manage database schema:

```bash
# Check migration status
npm run migrate status

# Create new migration
npm run migrate create migration_name

# Rollback last migration
npm run migrate down
```

Database includes these main tables:
- `users` - Staff and admin accounts
- `authentications` - JWT token management
- `tickets` - Support tickets
- `ticket_messages` - Chat history
- `ticket_notes` - Internal notes
- `faqs` - Knowledge base articles
- `ticket_drafts` - Draft tickets

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Use different port
PORT=3001 npm run dev
```

**Database connection failed:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists

**JWT token invalid:**
- Verify `JWT_SECRET` matches frontend configuration
- Check token expiration
- Refresh token if expired

**Gemini API errors:**
- Verify API key is valid
- Check rate limits
- Ensure pgvector extension is installed in PostgreSQL

---

## 📄 License

ISC

---

## 👥 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

---

**Last Updated:** August 2026  
**Repository:** [clunckyboy/helpdesk-ditsintek-backend](https://github.com/clunckyboy/helpdesk-ditsintek-backend)
