import { describe, expect, test } from 'vitest'
import data from '../src/services/datos.js'
import {
  getBookById,
  getBookIndexById,
  bookExists,
  booksFromUser,
  booksFromModule,
  booksCheeperThan,
  booksWithStatus,
  averagePriceOfBooks,
  booksOfTypeNotes,
  booksNotSold,
  incrementPriceOfbooks,
  getUserById,
  getUserIndexById,
  getUserByNickName,
  getModuleByCode,
} from '../src/functions.js'

// Estas pruebas comprueban las funciones relacionadas con los libros.
// Se utiliza el fichero real de datos para verificar el comportamiento
// con la información que usa actualmente la aplicación.
describe('Funciones de libros', () => {
  // Busca un libro por su identificador y devuelve el objeto completo.
  test('getBookById devuelve el libro indicado', () => {
    expect(getBookById(data.books, 1)).toEqual(data.books[0])
  })

  // Si el identificador no existe, la función debe avisar mediante una excepción.
  test('getBookById lanza una excepción si no existe', () => {
    expect(() => getBookById(data.books, 999)).toThrow('Libro no encontrado')
  })

  // Obtiene la posición que ocupa un libro dentro del array.
  test('getBookIndexById devuelve el índice del libro', () => {
    expect(getBookIndexById(data.books, 7)).toBe(2)
  })

  // También debe fallar cuando se solicita un libro inexistente.
  test('getBookIndexById lanza una excepción si no existe', () => {
    expect(() => getBookIndexById(data.books, 999)).toThrow('Libro no encontrado')
  })

  // Comprueba que un usuario ya tiene un libro de un módulo concreto.
  test('bookExists comprueba usuario y módulo', () => {
    expect(bookExists(data.books, 4, '5021')).toBe(true)
    expect(bookExists(data.books, 3, '5025')).toBe(false)
  })

  // Filtra todos los libros publicados por un usuario.
  test('booksFromUser devuelve los libros del usuario', () => {
    expect(booksFromUser(data.books, 4).map((book) => book.id)).toEqual([7, 8, 9])
  })

  // Filtra todos los libros pertenecientes a un módulo.
  test('booksFromModule devuelve los libros del módulo', () => {
    expect(booksFromModule(data.books, '5021').map((book) => book.id)).toEqual([6, 7, 10])
  })

  // Incluye los libros cuyo precio es igual o inferior al límite indicado.
  test('booksCheeperThan devuelve libros con precio menor o igual', () => {
    expect(booksCheeperThan(data.books, 15).map((book) => book.id)).toEqual([1, 7, 8, 10])
  })

  // Filtra los libros por su estado de conservación.
  test('booksWithStatus filtra por estado', () => {
    expect(booksWithStatus(data.books, 'new').map((book) => book.id)).toEqual([6])
  })

  // El resultado debe ser texto, con dos decimales y el símbolo del euro.
  test('averagePriceOfBooks devuelve el promedio con dos decimales y euros', () => {
    expect(averagePriceOfBooks(data.books)).toBe('26.17 €')
    expect(averagePriceOfBooks([])).toBe('0.00 €')
  })

  // Los apuntes se identifican porque su editorial es "Apunts".
  test('booksOfTypeNotes devuelve los apuntes', () => {
    expect(booksOfTypeNotes(data.books).map((book) => book.id)).toEqual([1, 9, 10])
  })

  // Un libro no vendido es el que todavía no tiene soldDate.
  test('booksNotSold devuelve los libros sin fecha de venta', () => {
    expect(booksNotSold(data.books).map((book) => book.id)).toEqual([6, 7, 8, 9, 10])
  })

  // El incremento devuelve un nuevo array y no cambia los datos originales.
  test('incrementPriceOfbooks aplica el porcentaje sin modificar el array original', () => {
    const incremented = incrementPriceOfbooks(data.books, 0.1)

    expect(incremented[0].price).toBe(13.2)
    expect(incremented[1].price).toBe(82.5)
    expect(data.books[0].price).toBe(12)
  })
})

// Estas pruebas comprueban las búsquedas de usuarios y módulos.
describe('Funciones de usuarios y módulos', () => {
  // Busca un usuario utilizando su id.
  test('getUserById devuelve el usuario indicado', () => {
    expect(getUserById(data.users, 3)).toEqual(data.users[1])
  })

  // Un id desconocido debe producir una excepción.
  test('getUserById lanza una excepción si no existe', () => {
    expect(() => getUserById(data.users, 999)).toThrow('Usuario no encontrado')
  })

  // Obtiene la posición del usuario dentro del array.
  test('getUserIndexById devuelve el índice del usuario', () => {
    expect(getUserIndexById(data.users, 4)).toBe(2)
  })

  // Comprueba el comportamiento cuando el usuario no existe.
  test('getUserIndexById lanza una excepción si no existe', () => {
    expect(() => getUserIndexById(data.users, 999)).toThrow('Usuario no encontrado')
  })

  // Busca un usuario mediante su nick.
  test('getUserByNickName devuelve el usuario indicado', () => {
    expect(getUserByNickName(data.users, 'Juan')).toEqual(data.users[1])
  })

  // Un nick desconocido debe producir una excepción.
  test('getUserByNickName lanza una excepción si no existe', () => {
    expect(() => getUserByNickName(data.users, 'Desconocido')).toThrow('Usuario no encontrado')
  })

  // Busca un módulo mediante su código.
  test('getModuleByCode devuelve el módulo indicado', () => {
    expect(getModuleByCode(data.modules, '5021')).toEqual(
      data.modules.find((module) => module.code === '5021'),
    )
  })

  // Un código desconocido debe producir una excepción.
  test('getModuleByCode lanza una excepción si no existe', () => {
    expect(() => getModuleByCode(data.modules, '9999')).toThrow('Módulo no encontrado')
  })
})
