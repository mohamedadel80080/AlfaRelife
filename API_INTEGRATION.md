# API Integration Documentation

## Overview

This document describes the integration with the external pharmacy registration and questions API.

### External API Base URL
```
http://127.0.0.1:8000/api/
```

### Proxy API Routes (Used to avoid CORS)
```
http://localhost:3000/api/proxy/
```

**Why Proxy?** The external API doesn't allow CORS requests from `localhost:3000`. We use Next.js API routes as a proxy to forward requests to the external API from the server-side, which bypasses CORS restrictions.

---

## 1. Registration API Integration

**POST** `/register`

#### Request Headers
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

#### Request Body
```json
{
  "first_name": "mokhtar",
  "last_name": "ali",
  "email": "modk1210000@app.com",
  "phone": "01000032",
  "password": "123456789",
  "password_confirmation": "123456789",
  "address": "address description",
  "city": "city name",
  "district_id": 4,
  "postcode": "456456",
  "position": "pharmacian",
  "licence": "2343240341032",
  "province": "province",
  "lat": 30.2525252,
  "lng": 31.025552,
  "business_name": "test",
  "gst": "yes",
  "business_type": "good"
}
```

#### Response (Success)
```json
{
  "access_token": "JWT_TOKEN_HERE",
  "token_type": "bearer",
  "expires_in": 1137000000,
  "phone_verified": null,
  "completed": null,
  "status": null
}
```

#### Response (Error)
```json
{
  "message": "Error message",
  "errors": {
    "field_name": ["Error description"]
  }
}
```

---

## 2. Questions API Integration

### Fetch Questions Endpoint

**GET** `/questions`

#### Request Headers
```json
{
  "Authorization": "Bearer {access_token}",
  "Accept": "application/json"
}
```

#### Response (Success)
```json
{
  "data": [
    {
      "id": 3,
      "question": "Have you ever been convicted of a felony or been charged with a criminal offence for which a pardon has not been granted?"
    },
    {
      "id": 4,
      "question": "Have you ever been found guilty of professional malpractice, misconduct or incapacitated by your provincial licensing authority?"
    },
    {
      "id": 5,
      "question": "Are you legally eligible to work in Canada?"
    },
    {
      "id": 6,
      "question": "Have you ever had your Provincial License restricted, suspended or revoked by your provincial licensing authority?"
    },
    {
      "id": 7,
      "question": "Is your license currently registered as active with your provincial pharmacy licensing authority and in good standing?"
    }
  ]
}
```

### Submit Answers Endpoint

**POST** `/answers`

#### Request Headers
```json
{
  "Authorization": "Bearer {access_token}",
  "Accept": "application/json",
  "Content-Type": "application/x-www-form-urlencoded"
}
```

#### Request Body Format
```
question[0][id]=3
question[0][answer]=false

question[1][id]=4
question[1][answer]=false

question[2][id]=5
question[2][answer]=true

question[3][id]=6
question[3][answer]=false

question[4][id]=7
question[4][answer]=true
```

#### Response (Success)
```json
{
  "success": true,
  "message": "Answers submitted successfully"
}
```

#### Response (Error)
```json
{
  "message": "Error message",
  "errors": {
    "field_name": ["Error description"]
  }
}
```

---

## Implementation Details

### Files Modified/Created

1. **`src/lib/api.ts`** - Updated API utility file
   - Changed BASE_URL to use proxy routes (`/api/proxy`)
   - `register()` - Registration API call via proxy
   - `fetchQuestions()` - Fetch questions from API via proxy
   - `submitAnswers()` - Submit answers with x-www-form-urlencoded format via proxy
   - `getAuthToken()` - Retrieve stored token
   - `getAuthHeader()` - Generate Authorization header
   - `apiRequest()` - Generic authenticated API call wrapper
   - `isAuthenticated()` - Check authentication status
   - `clearAuth()` - Clear all auth data

2. **`src/app/api/proxy/register/route.ts`** - New proxy route for registration
   - Forwards POST requests to external API
   - Handles CORS by making server-side requests
   - Returns response with proper error handling

3. **`src/app/api/proxy/questions/route.ts`** - New proxy route for questions
   - Forwards GET requests with Authorization header
   - Fetches questions from external API
   - Returns questions data to client

4. **`src/app/api/proxy/answers/route.ts`** - New proxy route for answers
   - Forwards POST requests with x-www-form-urlencoded data
   - Includes Authorization header
   - Returns submission result

5. **`src/components/healthcare/QuestionsForm.tsx`** - Updated
   - Fetches questions from API after registration
   - Displays Yes/No toggle for each question
   - Submits answers in x-www-form-urlencoded format
   - Added error handling with UI feedback
   - Requires authentication token to load

6. **`src/components/healthcare/HealthcareRegistration.tsx`** - Updated
   - Registration happens at Step 2 (Location & Business)
   - Questions loaded at Step 3 (after registration)
   - Update progress calculation for flow
   - Added registration error handling

7. **`src/components/healthcare/LocationBusinessForm.tsx`** - Updated
   - Changed GST field from number input to yes/no selector
   - Updated validation logic

---

## Authentication Flow

### 1. User Registration (Steps 1-2)
1. User fills out the first 2 steps:
   - **Step 1:** Personal Information (name, email, phone, password)
   - **Step 2:** Location & Business Details

2. On Step 2 submission:
   - Collects all form data from Steps 1 & 2
   - Transforms data to match API format
   - Sends POST request to `/register` endpoint
   - Stores access token on success
   - Proceeds to Step 3 (Questions)

### 2. Questions (Step 3)
1. Fetches questions from `/questions` endpoint using stored token
2. Displays questions with Yes/No toggles
3. User answers all questions
4. Submits answers to `/answers` endpoint
5. On success, redirects to home/dashboard

**Note:** All API calls go through Next.js proxy routes (`/api/proxy/*`) to avoid CORS issues. The proxy routes forward requests to the external API from the server-side.

### 3. Token Storage
On successful registration:
```javascript
localStorage.setItem('auth_token', response.access_token)
localStorage.setItem('token_type', response.token_type)
localStorage.setItem('token_expires_in', response.expires_in)
```

### 4. Making Authenticated Requests
Use the `apiRequest` utility function:

```typescript
import { apiRequest } from '@/lib/api'

// Example: Get user profile
const profile = await apiRequest('/user/profile', {
  method: 'GET'
})

// Example: Update settings
const result = await apiRequest('/user/settings', {
  method: 'POST',
  body: JSON.stringify({ setting: 'value' })
})
```

The utility automatically:
- Adds `Authorization: Bearer {token}` header
- Handles JSON parsing
- Manages error responses
- Extracts validation errors

**Example: Fetch and Submit Questions**
```typescript
import { fetchQuestions, submitAnswers } from '@/lib/api'

// Fetch questions
const response = await fetchQuestions()
const questions = response.data

// Submit answers
const answers = [
  { id: 3, answer: false },
  { id: 4, answer: false },
  { id: 5, answer: true },
  { id: 6, answer: false },
  { id: 7, answer: true }
]

await submitAnswers(answers)
```

The `submitAnswers` function automatically:
- Formats data as x-www-form-urlencoded
- Adds required headers including Authorization
- Handles errors and validation messages

---

## Error Handling

### API Errors
The integration handles two types of errors:

1. **General Errors**
```json
{
  "message": "Error description"
}
```

2. **Validation Errors**
```json
{
  "errors": {
    "email": ["The email has already been taken."],
    "phone": ["The phone format is invalid."]
  }
}
```

All errors are displayed to the user in a red alert box above the form.

### UI States
- **Loading State:** Shows spinner and disabled buttons during submission
- **Error State:** Displays error message in alert
- **Success State:** Redirects to success screen

---

## Data Mapping

### Form Data → API Format

| Form Field | API Field | Type | Notes |
|------------|-----------|------|-------|
| firstName | first_name | string | |
| lastName | last_name | string | |
| email | email | string | |
| phone | phone | string | |
| password | password | string | Min 8 chars |
| password | password_confirmation | string | Same as password |
| address | address | string | |
| city | city | string | |
| districtId | district_id | number | Extracted from "District X - Name" |
| postcode | postcode | string | |
| position | position | string | |
| licence | licence | string | |
| province | province | string | |
| lat | lat | number | Geolocation |
| lng | lng | number | Geolocation |
| businessName | business_name | string | |
| gst | gst | "yes"\|"no" | |
| businessType | business_type | string | Default: "good" |

---

## Security Considerations

### Token Storage
- Tokens stored in `localStorage`
- Access via utility functions only
- Clear tokens on logout

### HTTPS
- API uses HTTPS for secure transmission
- All requests include proper headers

### Token Usage
For future API calls, include the Authorization header:
```javascript
Authorization: Bearer {access_token}
```

Use the `getAuthHeader()` utility:
```typescript
import { getAuthHeader } from '@/lib/api'

fetch('/api/endpoint', {
  headers: {
    ...getAuthHeader(),
    'Content-Type': 'application/json'
  }
})
```

---

## Testing

### Manual Testing
1. Navigate to `/register`
2. Fill out all three form steps
3. Submit the registration
4. Check browser console for success message
5. Verify token in localStorage:
   ```javascript
   localStorage.getItem('auth_token')
   ```

### Test Data
```json
{
  "first_name": "Test",
  "last_name": "User",
  "email": "test@example.com",
  "phone": "1234567890",
  "password": "Test123456",
  "address": "123 Test Street",
  "city": "Toronto",
  "district_id": 1,
  "postcode": "M5H 2N2",
  "position": "Pharmacist",
  "licence": "12345678",
  "province": "Ontario",
  "lat": 43.6532,
  "lng": -79.3832,
  "business_name": "Test Pharmacy",
  "gst": "yes",
  "business_type": "good"
}
```

---

## Next Steps

### Recommended Enhancements
1. **Add logout functionality**
   - Create logout button
   - Call `clearAuth()` 
   - Redirect to login

2. **Add token refresh logic**
   - Check token expiration
   - Refresh before expiry
   - Handle 401 responses

3. **Add protected routes**
   - Check `isAuthenticated()` before rendering
   - Redirect to login if not authenticated

4. **Add loading states**
   - Show skeleton loaders
   - Handle network errors gracefully

5. **Add phone verification step**
   - If API supports it
   - Based on `phone_verified` flag

---

## API Utility Reference

### Functions

#### `getAuthToken()`
Returns the stored JWT token or null.

#### `getTokenType()`
Returns the token type (default: 'bearer').

#### `clearAuth()`
Removes all authentication data from localStorage.

#### `isAuthenticated()`
Returns true if user has a valid token.

#### `getAuthHeader()`
Returns headers object with Authorization header.

#### `apiRequest<T>(endpoint, options)`
Makes an authenticated API request.
- Returns parsed JSON response
- Throws error on failure
- Automatically includes auth headers

#### `register(data)`
Calls the registration endpoint with proper typing.

---

## Troubleshooting

### CORS Issues

**Problem:** "Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin"

**Solution:** This has been fixed by implementing Next.js API proxy routes. All external API calls are now routed through:
- `/api/proxy/register` - Registration endpoint
- `/api/proxy/questions` - Fetch questions
- `/api/proxy/answers` - Submit answers

The proxy routes make server-side requests to the external API, which bypasses CORS restrictions since CORS only applies to browser requests.

**How it works:**
1. Frontend calls `/api/proxy/register` (same origin, no CORS)
2. Next.js API route receives request
3. Server-side fetch to `http://127.0.0.1:8000/api/register`
4. Response forwarded back to frontend

### Common Issues

**Issue:** "Registration failed"
- Check network tab in browser DevTools
- Verify API is accessible
- Check request payload format

**Issue:** "Validation errors"
- Review error message details
- Ensure all required fields are filled
- Check data format (e.g., email, phone)

**Issue:** Token not stored
- Check browser console for errors
- Verify localStorage is enabled
- Check API response includes `access_token`

**Issue:** CORS errors
- API must allow requests from your domain
- Contact API administrator if needed

---

## Support

For API-related issues, contact the API provider.

For integration issues in this codebase, check:
1. Browser console for error messages
2. Network tab for request/response details
3. Code comments in affected files
