import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import Book from '../src/model/book.class.js'
import Books from '../src/model/books.class.js'
import Module from '../src/model/module.class.js'
import Modules from '../src/model/modules.class.js'
import User from '../src/model/user.class.js'
import Users from '../src/model/users.class.js'

const API_URL = 'http://localhost:3000'
const initialDB = {
  users: [
    { id: 2, nick: 'Ignasi', email: 'ignasi@example.com', password: '1234' },
    { id: 3, nick: 'Juan', email: 'juan@example.com', password: '1234' },
  ],
  modules: [{ code: '5021', cliteral: 'Ciberseguridad', vliteral: 'Ciberseguretat', courseId: '59' }],
  books: [
    { id: 1, userId: 2, moduleCode: '5021', publisher: 'Apunts', price: 12, pages: 25, status: 'good', photo: '', comments: '', soldDate: '' },
    { id: 6, userId: 3, moduleCode: '5021', publisher: 'McGraw-Hill', price: 75, pages: 273, status: 'new', photo: '', comments: '', soldDate: '' },
  ],
}

let db
const copyDB = () => JSON.parse(JSON.stringify(initialDB))
const findById = (items, id) => items.find((item) => item.id === Number(id))

const server = setupServer(
  http.get(`${API_URL}/users`, () => HttpResponse.json(db.users)),
  http.get(`${API_URL}/users/:id`, ({ params }) => {
    const user = findById(db.users, params.id)
    return user ? HttpResponse.json(user) : HttpResponse.json({}, { status: 404 })
  }),
  http.post(`${API_URL}/users`, async ({ request }) => {
    const user = { ...(await request.json()), id: 6 }
    db.users.push(user)
    return HttpResponse.json(user, { status: 201 })
  }),
  http.put(`${API_URL}/users/:id`, async ({ request, params }) => {
    const index = db.users.findIndex((user) => user.id === Number(params.id))
    if (index === -1) return HttpResponse.json({}, { status: 404 })
    const user = await request.json()
    db.users[index] = user
    return HttpResponse.json(user)
  }),
  http.delete(`${API_URL}/users/:id`, ({ params }) => {
    db.users = db.users.filter((user) => user.id !== Number(params.id))
    return HttpResponse.json({})
  }),
  http.get(`${API_URL}/modules`, () => HttpResponse.json(db.modules)),
  http.get(`${API_URL}/books`, () => HttpResponse.json(db.books)),
  http.get(`${API_URL}/books/:id`, ({ params }) => {
    const book = findById(db.books, params.id)
    return book ? HttpResponse.json(book) : HttpResponse.json({}, { status: 404 })
  }),
  http.post(`${API_URL}/books`, async ({ request }) => {
    const book = { ...(await request.json()), id: 11 }
    db.books.push(book)
    return HttpResponse.json(book, { status: 201 })
  }),
  http.put(`${API_URL}/books/:id`, async ({ request, params }) => {
    const index = db.books.findIndex((book) => book.id === Number(params.id))
    if (index === -1) return HttpResponse.json({}, { status: 404 })
    const book = await request.json()
    db.books[index] = book
    return HttpResponse.json(book)
  }),
  http.delete(`${API_URL}/books/:id`, ({ params }) => {
    db.books = db.books.filter((book) => book.id !== Number(params.id))
    return HttpResponse.json({})
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(() => {
  db = copyDB()
})

describe('Servicios API', () => {
  test('obtiene usuarios, módulos y libros', async () => {
    const { getDBBooks } = await import('../src/services/books.api.js')
    const { getDBModules } = await import('../src/services/modules.api.js')
    const { getDBUsers, getDBUser } = await import('../src/services/users.api.js')
    await expect(getDBBooks()).resolves.toHaveLength(2)
    await expect(getDBModules()).resolves.toEqual(initialDB.modules)
    await expect(getDBUsers()).resolves.toHaveLength(2)
    await expect(getDBUser(2)).resolves.toMatchObject({ nick: 'Ignasi' })
  })

  test('persiste altas, modificaciones, bajas y contraseñas', async () => {
    const { addDBBook, changeDBBook, removeDBBook } = await import('../src/services/books.api.js')
    const { addDBUser, changeDBUser, changeDBUserPassword, removeDBUser } = await import('../src/services/users.api.js')
    const book = await addDBBook({ userId: 2, moduleCode: '5021', publisher: 'Apunts', price: 20 })
    await expect(changeDBBook({ ...book, price: 25 })).resolves.toMatchObject({ price: 25 })
    await removeDBBook(book.id)
    const user = await addDBUser({ nick: 'Ana', email: 'ana@example.com', password: '1234' })
    await changeDBUser({ ...user, nick: 'Ana María' })
    await expect(changeDBUserPassword(2, 'secreta')).resolves.toMatchObject({ password: 'secreta' })
    await removeDBUser(user.id)
    expect(db.books).toHaveLength(2)
    expect(db.users).toHaveLength(2)
  })

  test('convierte errores HTTP en excepciones', async () => {
    const { getDBBook } = await import('../src/services/books.api.js')
    await expect(getDBBook(999)).rejects.toThrow('Error en la petición: 404')
  })

  test('envía objetos JSON con la cabecera correcta', async () => {
    server.use(
      http.post(`${API_URL}/books`, async ({ request }) => {
        expect(request.headers.get('Content-Type')).toContain('application/json')
        const body = await request.json()
        expect(body.publisher).toBe('Apunts')
        return HttpResponse.json({ ...body, id: 20 }, { status: 201 })
      }),
    )

    const { addDBBook } = await import('../src/services/books.api.js')
    await expect(addDBBook({ publisher: 'Apunts', price: 20 })).resolves.toMatchObject({ id: 20 })
  })

  test('acepta respuestas DELETE sin contenido', async () => {
    server.use(
      http.delete(`${API_URL}/books/1`, () => new HttpResponse(null, { status: 204 })),
    )

    const { removeDBBook } = await import('../src/services/books.api.js')
    await expect(removeDBBook(1)).resolves.toBeUndefined()
  })
})

describe('Clases persistentes', () => {
  test('populate no recibe datos y crea instancias correctas', async () => {
    const books = new Books()
    const users = new Users()
    const modules = new Modules()
    await Promise.all([books.populate(), users.populate(), modules.populate()])
    expect(books.data[0]).toBeInstanceOf(Book)
    expect(users.data[0]).toBeInstanceOf(User)
    expect(modules.data[0]).toBeInstanceOf(Module)
  })

  test('actualiza la colección local solo después de persistir', async () => {
    const books = new Books()
    const users = new Users()
    await Promise.all([books.populate(), users.populate()])
    const book = await books.addBook({ userId: 2, moduleCode: '5021', publisher: 'Apunts', price: 20 })
    await books.changeBook({ ...book, price: 25 })
    expect(books.getBookById(book.id).price).toBe(25)
    await books.removeBook(book.id)
    expect(() => books.getBookById(book.id)).toThrow('Libro no encontrado')
    const user = await users.addUser({ nick: 'Ana', email: 'ana@example.com', password: '1234' })
    await users.changeUserPassword(user.id, 'nueva')
    expect(users.getUserById(user.id).password).toBe('nueva')
    await users.removeUser(user.id)
    expect(() => users.getUserById(user.id)).toThrow('Usuario no encontrado')
  })

  test('no cambia la colección local si la API rechaza una operación', async () => {
    const books = new Books()
    await books.populate()
    server.use(http.delete(`${API_URL}/books/1`, () => HttpResponse.json({}, { status: 500 })))
    await expect(books.removeBook(1)).rejects.toThrow('Error en la petición: 500')
    expect(books.getBookById(1)).toBeInstanceOf(Book)
  })
})
