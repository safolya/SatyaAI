# SatyaAI - Misinformation Detection Platform

SatyaAI is a sophisticated misinformation detection and credibility analysis platform that uses Google's Gemini AI to analyze content for credibility, detect manipulative techniques, and provide detailed fact-checking reports.

## Features

- **AI-Powered Analysis**: Uses Google Gemini 2.0 Flash for advanced content analysis
- **Comprehensive Credibility Reports**: Provides detailed scores, summaries, and fact-checking
- **User Authentication**: Secure Firebase email/password authentication
- **Analysis History**: Track and manage your analysis reports
- **RESTful API**: Clean, documented API endpoints
- **MongoDB Storage**: Persistent storage of analysis reports

## Project Structure

```
backend/
├── config/
│   └── firebase.js          # Firebase Admin SDK configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── model/
│   └── report.js            # MongoDB schema for reports
├── routes/
│   ├── authRouter.js        # Authentication endpoints
│   └── analyzeRouter.js     # Content analysis endpoints
├── index.js                 # Main server file
├── package.json             # Dependencies
└── env.template             # Environment variables template
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Firebase project with Admin SDK
- Google Gemini API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd SatyaAI/backend
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Copy the values to your `.env` file

### 3. Environment Configuration

Copy `env.template` to `.env` and fill in your values:

```bash
cp env.template .env
```

Required environment variables:
- **Firebase**: All FIREBASE_* variables from your service account JSON
- **GEMINI_API_KEY**: Your Google Gemini API key
- **MONGODB_URI**: MongoDB connection string
- **PORT**: Server port (default: 3000)

### 4. Start the Server

```bash
npm start
# or
node index.js
```

The server will start on port 3000 (or your configured PORT).

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/account` - Delete user account

### Content Analysis

- `POST /api/analyze/text` - Analyze text content (requires auth)
- `GET /api/analyze/history` - Get user's analysis history
- `GET /api/analyze/report/:id` - Get specific report
- `DELETE /api/analyze/report/:id` - Delete report

## Usage Examples

### User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "displayName": "John Doe"
  }'
```

### Content Analysis

```bash
curl -X POST http://localhost:3000/api/analyze/text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -d '{
    "question": "Your content to analyze here..."
  }'
```

## Authentication Flow

1. **Registration**: User creates account with email/password
2. **Login**: User authenticates and receives Firebase ID token
3. **API Calls**: Include token in Authorization header: `Bearer <token>`
4. **Token Verification**: Server verifies token using Firebase Admin SDK
5. **User Context**: Request includes user information for personalization

## Security Features

- Firebase ID token verification
- User isolation (users can only access their own reports)
- Secure password handling (Firebase manages this)
- Input validation and sanitization
- Error handling without information leakage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License

## Support

For issues and questions, please open an issue in the repository.
