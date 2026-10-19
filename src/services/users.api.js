const API_URL = import.meta.env.VITE_API_URL

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options)

  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined
  }

  return response.json()
}

function sendJSON(method, data) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}

export function getDBUsers() {
  return request('/users')
}

export function getDBUser(userId) {
  return request(`/users/${userId}`)
}

export function addDBUser(user) {
  return request('/users', sendJSON('POST', user))
}

export function removeDBUser(userId) {
  return request(`/users/${userId}`, { method: 'DELETE' })
}

export function changeDBUser(user) {
  return request(`/users/${user.id}`, sendJSON('PUT', user))
}

export async function changeDBUserPassword(userId, password) {
  const user = await getDBUser(userId)
  return changeDBUser({ ...user, password })
}
