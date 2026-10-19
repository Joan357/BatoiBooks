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

export function getDBBooks() {
  return request('/books')
}

export function getDBBook(bookId) {
  return request(`/books/${bookId}`)
}

export function addDBBook(book) {
  return request('/books', sendJSON('POST', book))
}

export function removeDBBook(bookId) {
  return request(`/books/${bookId}`, { method: 'DELETE' })
}

export function changeDBBook(book) {
  return request(`/books/${book.id}`, sendJSON('PUT', book))
}
