export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.vercel.app'  // Update after backend deployment
  : 'http://localhost:5000'
