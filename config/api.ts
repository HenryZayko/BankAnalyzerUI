const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  endpoints: {
    analyze: '/analyze'
  }
}

export default API_CONFIG 