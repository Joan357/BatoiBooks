import { describe, expect, test } from 'vitest'
import {
  averagePriceOfBooks,
  bookExists,
  booksCheeperThan,
  booksFromModule,
  booksFromUser,
  booksNotSold,
  booksOfTypeNotes,
  booksWithStatus,
  getBookById,
  getBookIndexById,
  getModuleByCode,
  getUserById,
  getUserByNickName,
  getUserIndexById,
  incrementPriceOfbooks,
} from '../src/functions.js'

const books = [
  { id: 1, userId: 2, moduleCode: '5025', publisher: 'Apunts', price: 12, status: 'good', soldDate: '2023-02-01' },
  { id: 6, userId: 3, moduleCode: '5021', publisher: 'McGraw-Hill', price: 75, status: 'new', soldDate: '' },
  { id: 7, userId: 4, moduleCode: '5021', publisher: 'McGraw-Hill', price: 15, status: 'bad', soldDate: '' },
]
const users = [{ id: 2, nick: 'Ignasi' }, { id: 3, nick: 'Juan' }, { id: 4, nick: 'Marta' }]
const modules = [{ code: '5021', cliteral: 'Incidentes de ciberseguridad' }]

describe('Funciones de libros', () => {
  test('busca libros y sus índices', () => {
    expect(getBookById(books, 1)).toBe(books[0])
    expect(getBookIndexById(books, 7)).toBe(2)
    expect(() => getBookById(books, 999)).toThrow('Libro no encontrado')
    expect(() => getBookIndexById(books, 999)).toThrow('Libro no encontrado')
  })

  test('filtra libros y calcula precios', () => {
    expect(bookExists(books, 4, '5021')).toBe(true)
    expect(booksFromUser(books, 4).map((book) => book.id)).toEqual([7])
    expect(booksFromModule(books, '5021').map((book) => book.id)).toEqual([6, 7])
    expect(booksCheeperThan(books, 15).map((book) => book.id)).toEqual([1, 7])
    expect(booksWithStatus(books, 'new').map((book) => book.id)).toEqual([6])
    expect(booksOfTypeNotes(books).map((book) => book.id)).toEqual([1])
    expect(booksNotSold(books).map((book) => book.id)).toEqual([6, 7])
    expect(averagePriceOfBooks(books)).toBe('34.00 €')
    expect(incrementPriceOfbooks(books, 0.1)[0].price).toBe(13.2)
    expect(books[0].price).toBe(12)
  })
})

describe('Funciones de usuarios y módulos', () => {
  test('busca usuarios y módulos y lanza errores si no existen', () => {
    expect(getUserById(users, 3)).toBe(users[1])
    expect(getUserIndexById(users, 4)).toBe(2)
    expect(getUserByNickName(users, 'Juan')).toBe(users[1])
    expect(getModuleByCode(modules, '5021')).toBe(modules[0])
    expect(() => getUserById(users, 999)).toThrow('Usuario no encontrado')
    expect(() => getUserByNickName(users, 'Desconocido')).toThrow('Usuario no encontrado')
    expect(() => getModuleByCode(modules, '9999')).toThrow('Módulo no encontrado')
  })
})
