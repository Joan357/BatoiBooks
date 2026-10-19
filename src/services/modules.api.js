const API_URL = import.meta.env.VITE_API_URL

async function request(path) {
  const response = await fetch(`${API_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status}`)
  }

  return response.json()
}

export function getDBModules() {
  return request('/modules')
}
