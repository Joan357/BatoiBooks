import { describe, expect, test } from 'vitest'
import Book from '../src/model/book.class.js'
import Books from '../src/model/books.class.js'
import Module from '../src/model/module.class.js'
import Modules from '../src/model/modules.class.js'
import User from '../src/model/user.class.js'
import Users from '../src/model/users.class.js'

const bookData = [
  {
    id: 1,
    userId: 2,
    moduleCode: '5021',
    publisher: 'Apunts',
    price: 12,
    pages: 25,
    status: 'good',
    soldDate: '',
  },
  {
    id: 6,
    userId: 3,
    moduleCode: '5025',
    publisher: 'McGraw-Hill',
    price: 75,
    pages: 273,
    status: 'new',
    soldDate: '2024-01-01',
  },
]

describe('Consultas de Books', () => {
  test('populate crea objetos Book', () => {
    const books = new Books()
    books.data = bookData.map((book) => new Book(book))

    expect(books.data[0]).toBeInstanceOf(Book)
    expect(books.getBookById(1)).toBe(books.data[0])
    expect(books.getBookIndexById(6)).toBe(1)
  })

  test('filtra libros por usuario, módulo y estado', () => {
    const books = new Books()
    books.data = bookData.map((book) => new Book(book))

    expect(books.booksFromUser(2)).toHaveLength(1)
    expect(books.booksFromModule('5021')).toHaveLength(1)
    expect(books.booksWithStatus('new')).toHaveLength(1)
    expect(books.booksCheeperThan(12)).toHaveLength(1)
    expect(books.booksOfTypeNotes()).toHaveLength(1)
    expect(books.booksNotSold()).toHaveLength(1)
  })

  test('calcula el precio medio y convierte los libros a texto', () => {
    const books = new Books()
    books.data = bookData.map((book) => new Book(book))

    expect(books.averagePriceOfBooks()).toBe('43.50 €')
    expect(books.toString()).toContain('1: Apunts (5021) - 12 €')
    expect(new Books().averagePriceOfBooks()).toBe('0.00 €')
  })

  test('lanza errores si no encuentra un libro', () => {
    const books = new Books()
    books.data = bookData.map((book) => new Book(book))

    expect(() => books.getBookById(99)).toThrow('Libro no encontrado')
    expect(() => books.getBookIndexById(99)).toThrow('Libro no encontrado')
  })
})

describe('Consultas de Users y Modules', () => {
  test('Users busca por id, índice y nick', () => {
    const users = new Users()
    users.data = [
      new User(2, 'Ignasi', 'ignasi@example.com', '1234'),
      new User(3, 'Juan', 'juan@example.com', '1234'),
    ]

    expect(users.getUserById(2).nick).toBe('Ignasi')
    expect(users.getUserIndexById(3)).toBe(1)
    expect(users.getUserByNick('Juan').id).toBe(3)
    expect(users.getUserByNickName('Juan').id).toBe(3)
    expect(users.toString()).toContain('Ignasi')
  })

  test('Users lanza errores si no encuentra un usuario', () => {
    const users = new Users()

    expect(() => users.getUserById(99)).toThrow('Usuario no encontrado')
    expect(() => users.getUserIndexById(99)).toThrow('Usuario no encontrado')
    expect(() => users.getUserByNickName('Desconocido')).toThrow('Usuario no encontrado')
  })

  test('Modules busca por código y convierte a texto', () => {
    const modules = new Modules()
    modules.data = [new Module('5021', 'Ciberseguridad', 'Ciberseguretat', '59')]

    expect(modules.getModuleByCode('5021').cliteral).toBe('Ciberseguridad')
    expect(modules.toString()).toContain('5021: Ciberseguridad')
    expect(() => modules.getModuleByCode('9999')).toThrow('Módulo no encontrado')
  })
})
