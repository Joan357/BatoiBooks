import Book from './book.class.js'

export default class Books {
  constructor() {
    this.data = []
  }

  populate(items) {
    this.data = items.map((item) => new Book(item))
  }

  addBook(bookData) {
    const lastId = this.data.reduce((max, book) => Math.max(max, book.id), 0)
    const book = new Book({ ...bookData, id: lastId + 1 })
    this.data.push(book)
    return book
  }

  removeBook(id) {
    const index = this.data.findIndex((book) => book.id === id)
    if (index === -1) throw new Error('Libro no encontrado')
    this.data.splice(index, 1)
  }

  changeBook(bookData) {
    const index = this.data.findIndex((book) => book.id === bookData.id)
    if (index === -1) throw new Error('Libro no encontrado')
    const book = new Book(bookData)
    this.data[index] = book
    return book
  }

  getBookById(id) {
    return this.data.find((book) => book.id === id)
  }

  getBookIndexById(id) {
    return this.data.findIndex((book) => book.id === id)
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

  incrementPriceOfbooks(percentage) {
    return this.data.map((book) => {
      return new Book({
        ...book,
        price: Number((book.price * (1 + percentage)).toFixed(2)),
      })
    })
  }

  toString() {
    return this.data.map((book) => book.toString()).join('\n')
  }
}
