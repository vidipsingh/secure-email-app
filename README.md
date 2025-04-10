# Secure Email Application
A modern web application that allows users to securely access and download email attachments using the Gmail API. Built with React (frontend), FastAPI (backend), and MongoDB.

## Table of Contents- 
1. Setup and Running Locally
2. API Endpoints
3. Example Test Cases

## Setup and Running Locally

### Prerequisites- 
- Node.js (v14 or later)
- Python 3.11- MongoDB Atlas account
- Google Cloud Project with Gmail API enabled

### Installation Steps1. 
1. Clone the Repository
2. git clone https://github.com/vidipsingh/secure-email-app
3. cd secure-email-app

1.  **Backend Setup**
    
    *   Install dependencies:
    *       cd backend
    *       python -m venv venvsource venv/bin/activate
    *       # On Windows: venv\\Scripts\\activate_
    *       pip install -r requirements.txt
        
    *   Configure environment variables in backend/.env:
```bash
MONGO_URI=mongodb+srv://:@cluster0.mongodb.net/email\_app?retryWrites=true&w=majority
SECRET_KEY=your-secret-key-here
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secretGOOGLE
REFRESH_TOKEN=your-refresh-token

```
                
2.  **Frontend Setup**
    
    *   Install dependencies:
        ```bash
        cd ../frontend
        npm install
        ```
        
    *   Configure environment variables in frontend/.env
    *       REACT\_APP\_API\_URL=http://localhost:8000
        
3.  **Run the Application**
    
    *   Start the backend:
    *       cd ../backend
    *       uvicorn app.main:app --reload
        
    *   Start the frontend:
    *       cd ../frontend
    *       npm start
        
    *   Open http://localhost:3000 in your browser.
        

API Endpoints
-------------

### 1\. /register (POST)

*   **Description**: Registers a new user with an email and password.
    
*   **Request Body**:jsonCollapseWrapCopy{ "email": "user@example.com", "password": "securepassword"}
    
*   **Response**: {"message": "User registered successfully"} (200) or error (400 if email exists).
    
*   **Authentication**: None
    

### 2\. /token (POST)

*   **Description**: Authenticates a user and returns a JWT token.
    
*   **Request Body** (x-www-form-urlencoded):
    
    *   username: [user@example.com](mailto:user@example.com)
        
    *   password: securepassword
        
*   **Response**: {"access\_token": "user@example.com", "token\_type": "bearer"} (200) or error (401 for invalid credentials).
    
*   **Authentication**: None
    

### 3\. /emails (GET)

*   **Description**: Retrieves a list of emails for the authenticated user.
    
*   **Request Headers**: Authorization: Bearer user@example.com
    
*   **Response**: Array of email objects (200) or error (401 if unauthorized, 500 if server error).
    
*   **Authentication**: Required
    

### 4\. /download/{message\_id}/{attachment\_id} (GET)

*   **Description**: Downloads an attachment for a specific email.
    
*   **Request Headers**: Authorization: Bearer user@example.com
    
*   **Response**: Base64-encoded attachment data (200) or error (500 if failed).
    
*   **Authentication**: Required
    

Example Test Cases
------------------

### Test Case 1: Register a New User

*   **Request**:bashCollapseWrapCopycurl -X POST "http://localhost:8000/register" \\ -H "Content-Type: application/json" \\ -d '{"email": "test@example.com", "password": "testpass123"}'
    
*   **Expected Response**: {"message": "User registered successfully"} (200)
    

### Test Case 2: Login with Valid Credentials

*   **Request**:bashCollapseWrapCopycurl -X POST "http://localhost:8000/token" \\ -H "Content-Type: application/x-www-form-urlencoded" \\ -d "username=test@example.com&password=testpass123"
    
*   **Expected Response**: {"access\_token": "test@example.com", "token\_type": "bearer"} (200)
    

### Test Case 3: Fetch Emails with Invalid Token

*   **Request**:bashCollapseWrapCopycurl -X GET "http://localhost:8000/emails" \\ -H "Authorization: Bearer invalid-token"
    
*   **Expected Response**: 401 Unauthorized
    

### Test Case 4: Download Attachment

*   **Request**:bashCollapseWrapCopycurl -X GET "http://localhost:8000/download/123/456" \\ -H "Authorization: Bearer test@example.com"
    
*   **Expected Response**: Base64-encoded data (200) or 500 if attachment not found

*   No sensitive email content or attachments are stored in the database; these are fetched dynamically from the Gmail API.
    

Workflow
--------

1.  **User Registration**:
    
    *   User submits email and password via the /register endpoint.
        
    *   Password is hashed and stored in the users collection.
        
    *   Success response is returned, and user is prompted to log in.
        
2.  **User Authentication**:
    
    *   User provides email and password via the /token endpoint.
        
    *   Backend verifies credentials against the database, returns a JWT token if valid.
        
    *   Token is stored in localStorage on the frontend.
        
3.  **Email Retrieval**:
    
    *   Authenticated user requests /emails with the JWT token.
        
    *   Backend uses the Google API with a refresh token to fetch emails.
        
    *   Emails are returned as JSON, rendered on the frontend.
        
4.  **Attachment Download**:
    
    *   User clicks an attachment link, triggering a /download/{message\_id}/{attachment\_id} request.
        
    *   Backend fetches the attachment from Gmail API, returns base64 data.
        
    *   Frontend converts data to a downloadable file.
        

Implemented Security Measures
-----------------------------

*   **Encryption**: Passwords are hashed with bcrypt before storage, preventing plaintext exposure.
    
*   **Access Control**: MongoDB connection string is stored in .env, excluded from version control.
    
*   **Authentication**: JWT ensures only authorized users access protected endpoints.
    
*   **Data Minimization**: Only user credentials are stored; email content is not persisted locally.
    
*   **Error Handling**: Errors redirect to login or return appropriate HTTP codes, avoiding sensitive data leaks.
    

Future Improvements
-------------------

*   **Data Validation**: Add schema validation (e.g., using Mongoose) to enforce data types.
    
*   **Backup**: Implement regular backups of the users collection.
    
*   **Auditing**: Add logs for user actions (e.g., login, download) to track usage.
