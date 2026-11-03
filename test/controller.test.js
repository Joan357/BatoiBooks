// @vitest-environment jsdom

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import Controller from '../src/controller/index.js'

const API_URL = 'http://localhost:3000'
let books

const server = setupServer(
  http.get(`${API_URL}/users`, () => HttpResponse.json([{ id: 3, nick: 'Juan' }])),
  http.get(`${API_URL}/modules`, () => HttpResponse.json([{ code: '5021', cliteral: 'Ciberseguridad' }])),
  http.get(`${API_URL}/books`, () => HttpResponse.json(books)),
  http.post(`${API_URL}/books`, async ({ request }) => {
    const book = { ...(await request.json()), id: 7 }
    books.push(book)
    return HttpResponse.json(book, { status: 201 })
  }),
  http.delete(`${API_URL}/books/:id`, ({ params }) => {
    books = books.filter((book) => book.id !== Number(params.id))
    return HttpResponse.json({})
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

beforeEach(() => {
  books = [{
    id: 1,
    userId: 3,
    moduleCode: '5021',
    publisher: 'Apunts',
    price: 12,
    pages: 25,
    status: 'good',
    photo: '',
    comments: '',
    soldDate: '',
  }]

  document.body.innerHTML = `
    <div id="messages"></div>
    <div id="list"></div>
    <div id="remove">
      <input id="remove-book-id" type="number">
      <button id="remove-book-button" type="button">Borrar</button>
    </div>
    <div id="form"><form id="book-form">
      <select id="userId" name="userId"></select>
      <select id="moduleCode" name="moduleCode"></select>
      <input name="publisher"><input name="price"><input name="pages">
      <input name="status" type="radio" value="good">
      <input name="photo"><textarea name="comments"></textarea><input name="soldDate">
    </form></div>
    <div id="about"></div>
  `
})

describe('Controller', () => {
  test('carga los datos y actualiza la vista', async () => {
    const controller = new Controller()

    await controller.init()

    expect(controller.users.data).toHaveLength(1)
    expect(controller.modules.data).toHaveLength(1)
    expect(controller.books.data).toHaveLength(1)
    expect(document.querySelector('#userId').options).toHaveLength(2)
    expect(document.querySelector('#moduleCode').options).toHaveLength(2)
    expect(document.querySelectorAll('.card')).toHaveLength(1)
  })

  test('añade manualmente un libro y actualiza la vista', async () => {
    const controller = new Controller()
    await controller.init()
    document.querySelector('[name="publisher"]').value = 'Texto temporal'

    await controller.handleSubmitBook({
      userId: 3,
      moduleCode: '5021',
      publisher: 'Apunts',
      price: 20,
      pages: 40,
      status: 'new',
      photo: '',
      comments: '',
      soldDate: '',
    })

    expect(controller.books.data).toHaveLength(2)
    expect(document.querySelectorAll('.card')).toHaveLength(2)
    expect(document.querySelector('[name="publisher"]').value).toBe('')
  })

  test('elimina manualmente un libro y actualiza la vista', async () => {
    const controller = new Controller()
    await controller.init()

    await controller.handleRemoveBook(1)

    expect(controller.books.data).toHaveLength(0)
    expect(document.querySelectorAll('.card')).toHaveLength(0)
  })

  test('muestra un error cuando falla la carga', async () => {
    server.use(http.get(`${API_URL}/books`, () => HttpResponse.json({}, { status: 500 })))
    const controller = new Controller()

    await controller.init()

    expect(document.querySelector('.alert-error').textContent).toContain('Error cargando los datos')
  })

  test('comunica errores de alta y borrado sin confirmar éxito', async () => {
    const controller = new Controller()
    await controller.init()
    server.use(
      http.post(`${API_URL}/books`, () => HttpResponse.json({}, { status: 500 })),
      http.delete(`${API_URL}/books/:id`, () => HttpResponse.json({}, { status: 500 })),
    )

    expect(await controller.handleSubmitBook({ publisher: 'Apunts' })).toBeNull()
    expect(await controller.handleRemoveBook(1)).toBe(false)
    expect(document.querySelectorAll('.card')).toHaveLength(1)
    expect(document.querySelectorAll('.alert-error')).toHaveLength(2)
    expect(document.querySelector('.alert-info')).toBeNull()
  })

  test('los botones quedan conectados por el controlador', async () => {
    const controller = new Controller()
    await controller.init()
    const removeButton = document.querySelector('#remove-book-button')
    const removeInput = document.querySelector('#remove-book-id')

    removeInput.value = '1'
    removeButton.click()

    await vi.waitFor(() => expect(document.querySelectorAll('.card')).toHaveLength(0))
    expect(controller.books.data).toHaveLength(0)
  })
})
