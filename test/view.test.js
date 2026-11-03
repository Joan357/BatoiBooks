// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import View from '../src/view/index.js'

const modules = [
  { code: '5021', cliteral: 'Ciberseguridad' },
  { code: '5025', cliteral: 'Inglés' },
]

const users = [{ id: 3, nick: 'Juan' }]

const book = {
  id: 6,
  userId: 3,
  moduleCode: '5021',
  publisher: 'McGraw-Hill',
  price: 75,
  pages: 273,
  status: 'new',
  photo: '/foto.png',
  comments: 'Sense obrir',
  soldDate: '',
}

beforeEach(() => {
  document.body.innerHTML = `
    <div id="messages"></div>
    <div id="list"></div>
    <div id="remove">
      <input id="remove-book-id" type="number">
      <button id="remove-book-button" type="button">Borrar</button>
    </div>
    <div id="form">
      <form id="book-form">
        <select id="userId" name="userId" required></select>
        <select id="moduleCode" name="moduleCode" required></select>
        <input id="publisher" name="publisher" required>
        <input id="price" name="price" type="number" step="0.01" required>
        <input id="pages" name="pages" type="number" required>
        <input id="status-new" name="status" type="radio" value="new" required>
        <input id="photo" name="photo">
        <textarea id="comments" name="comments"></textarea>
        <input id="soldDate" name="soldDate" type="date">
      </form>
    </div>
    <div id="about"></div>
  `
})

afterEach(() => vi.useRealTimers())

describe('View', () => {
  test('guarda las referencias principales del DOM', () => {
    const view = new View()

    expect(view.booksList.id).toBe('list')
    expect(view.about.id).toBe('about')
    expect(view.form.id).toBe('form')
    expect(view.bookForm.id).toBe('book-form')
    expect(view.moduleSelect.id).toBe('moduleCode')
    expect(view.messages.id).toBe('messages')
  })

  test('rellena los select de usuarios y módulos', () => {
    const view = new View()

    view.renderUsers(users)
    view.renderModules(modules)

    expect(view.userSelect.options).toHaveLength(2)
    expect(view.userSelect.options[1].textContent).toBe('Juan (3)')
    expect(view.moduleSelect.options).toHaveLength(3)
    expect(view.moduleSelect.options[1].value).toBe('5021')
  })

  test('crea una tarjeta con la estructura indicada', () => {
    const view = new View()

    view.renderBooks([book], modules)

    const card = document.querySelector('.card')
    expect(card.dataset.bookId).toBe('6')
    expect(card.querySelector('.card-img img').alt).toBe('Libro: 6')
    expect(card.querySelector('h3').textContent).toBe('Ciberseguridad (6)')
    expect(card.textContent).toContain('McGraw-Hill')
    expect(card.textContent).toContain('273 páginas')
    expect(card.textContent).toContain('Estado: new')
    expect(card.textContent).toContain('En venta')
    expect(card.textContent).toContain('75.00 €')

    view.renderBooks([{ ...book, photo: '' }], modules)
    expect(document.querySelector('.card-img img').getAttribute('src')).toBe('/logoBatoi.png')

    view.renderBooks([{ ...book, soldDate: '2023-12-21' }], modules)
    expect(document.querySelector('.card').textContent).toContain('Vendido el 21/12/2023')
  })

  test('actualiza la lista sin duplicar tarjetas y permite borrarlas', () => {
    const view = new View()

    view.renderBooks([book, { ...book, id: 7 }], modules)
    view.renderBooks([book], modules)
    expect(document.querySelectorAll('.card')).toHaveLength(1)

    view.removeBook(6)
    expect(document.querySelectorAll('.card')).toHaveLength(0)
  })

  test('obtiene todos los campos del formulario con sus tipos', () => {
    const view = new View()
    view.renderUsers(users)
    view.renderModules(modules)
    document.querySelector('#userId').value = '3'
    document.querySelector('#moduleCode').value = '5021'
    document.querySelector('#publisher').value = '  Apunts  '
    document.querySelector('#price').value = '12.50'
    document.querySelector('#pages').value = '40'
    document.querySelector('#status-new').checked = true
    document.querySelector('#photo').value = '/foto.png'
    document.querySelector('#comments').value = 'Buen estado'
    document.querySelector('#soldDate').value = '2023-12-21'

    expect(view.getBookData()).toEqual({
      userId: 3,
      moduleCode: '5021',
      publisher: 'Apunts',
      price: 12.5,
      pages: 40,
      status: 'new',
      photo: '/foto.png',
      comments: 'Buen estado',
      soldDate: '2023-12-21',
    })
  })

  test('cierra mensajes informativos y mantiene los errores', () => {
    vi.useFakeTimers()
    const view = new View()

    view.showMessage('info', 'Libro añadido')
    vi.advanceTimersByTime(3000)
    expect(document.querySelector('.alert-info')).toBeNull()

    view.showMessage('error', 'Error de red')
    vi.advanceTimersByTime(3000)
    expect(document.querySelector('.alert-error')).not.toBeNull()
  })

  test('el callback del formulario recibe los datos al enviarlo', () => {
    const view = new View()
    const callback = vi.fn()
    view.renderUsers(users)
    view.renderModules(modules)
    view.bindSubmitBook(callback)

    document.querySelector('#userId').value = '3'
    document.querySelector('#moduleCode').value = '5021'
    document.querySelector('#publisher').value = 'Apunts'
    document.querySelector('#price').value = '12.50'
    document.querySelector('#pages').value = '40'
    document.querySelector('#status-new').checked = true
    document.querySelector('#photo').value = '/foto.png'
    document.querySelector('#comments').value = 'Buen estado'
    document.querySelector('#soldDate').value = '2023-12-21'
    view.bookForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    expect(callback).toHaveBeenCalledOnce()
    expect(callback.mock.calls[0][0]).toMatchObject({
      userId: 3,
      moduleCode: '5021',
      price: 12.5,
      pages: 40,
      status: 'new',
    })
  })

  test('el reset limpia el formulario sin eliminarlo', () => {
    const view = new View()
    const form = view.bookForm
    document.querySelector('#publisher').value = 'Apunts'

    form.reset()

    expect(document.querySelector('#book-form')).toBe(form)
    expect(document.querySelector('#publisher').value).toBe('')
  })

  test('el callback de borrado recibe la ID y una ID vacía muestra error', () => {
    const view = new View()
    const callback = vi.fn()
    view.bindRemoveBook(callback)

    document.querySelector('#remove-book-button').click()
    expect(callback).not.toHaveBeenCalled()
    expect(document.querySelector('.alert-error').textContent).toContain('ID de libro válida')

    document.querySelector('#remove-book-id').value = '6'
    document.querySelector('#remove-book-button').click()
    expect(callback).toHaveBeenCalledWith(6)
  })
})
