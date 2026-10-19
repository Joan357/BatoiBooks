import Book from './book.class.js'
import {
  addDBBook,
  changeDBBook,
  getDBBooks,
  removeDBBook,
} from '../services/books.api.js'

export default class Books {
  constructor() {
    this.data = []
  }

  async populate() {
    const items = await getDBBooks()
    this.data = items.map((item) => new Book(item))
    return this.data
  }

  async addBook(bookData) {
    const savedBook = await addDBBook(bookData)
    const book = new Book(savedBook)
    this.data.push(book)
    return book
  }

  async removeBook(id) {
    const index = this.getBookIndexById(id)
    await removeDBBook(id)
    this.data.splice(index, 1)
  }

  async changeBook(bookData) {
    const index = this.getBookIndexById(bookData.id)
    const savedBook = await changeDBBook(bookData)
    const book = new Book(savedBook)
    this.data[index] = book
    return book
  }

  getBookById(id) {
    const book = this.data.find((item) => item.id === id)
    if (!book) throw new Error('Libro no encontrado')
    return book
  }

  getBookIndexById(id) {
    const index = this.data.findIndex((book) => book.id === id)
    if (index === -1) throw new Error('Libro no encontrado')
    return index
  }

  booksFromUser(userId) {
    return this.data.filter((book) => book.userId === userId)
  }

  booksFromModule(moduleCode) {
    return this.data.filter((book) => book.moduleCode === moduleCode)
  }

  booksWithStatus(status) {
    return this.data.filter((book) => book.status === status)
  }

  booksCheeperThan(price) {
    return this.data.filter((book) => book.price <= price)
  }

  booksOfTypeNotes() {
    return this.data.filter((book) => book.publisher === 'Apunts')
  }

  booksNotSold() {
    return this.data.filter((book) => book.soldDate === '')
  }

  averagePriceOfBooks() {
    if (!this.data.length) return '0.00 €'
    const total = this.data.reduce((sum, book) => sum + book.price, 0)
    return `${(total / this.data.length).toFixed(2)} €`
  }

  toString() {
    return this.data.map((book) => book.toString()).join('\n')
  }
}
