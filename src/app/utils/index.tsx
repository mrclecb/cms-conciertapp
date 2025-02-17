const API_KEY = process.env.API_KEY

// Función para verificar el API key
export function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === API_KEY
}
