export function getBookById(books, bookId) {
  const book = books.find((item) => item.id === bookId)
  if (!book) throw new Error('Libro no encontrado')
  return book
}

export function getBookIndexById(books, bookId) {
  const index = books.findIndex((item) => item.id === bookId)
  if (index === -1) throw new Error('Libro no encontrado')
  return index
}

export function bookExists(books, userId, moduleCode) {
  return books.some((book) => book.userId === userId && book.moduleCode === moduleCode)
}

export function booksFromUser(books, userId) {
  return books.filter((book) => book.userId === userId)
}

export function booksFromModule(books, moduleCode) {
  return books.filter((book) => book.moduleCode === moduleCode)
}

export function booksCheeperThan(books, price) {
  return books.filter((book) => book.price <= price)
}

export function booksWithStatus(books, status) {
  return books.filter((book) => book.status === status)
}

export function averagePriceOfBooks(books) {
  if (books.length === 0) return '0.00 €'
  const total = books.reduce((sum, book) => sum + Number(book.price), 0)
  return `${(total / books.length).toFixed(2)} €`
}

export function booksOfTypeNotes(books) {
  return books.filter((book) => book.publisher === 'Apunts')
}

export function booksNotSold(books) {
  return books.filter((book) => book.soldDate === '')
}

export function incrementPriceOfbooks(books, percentage) {
  return books.map((book) => {
    return {
      ...book,
      price: Number((book.price * (1 + percentage)).toFixed(2)),
    }
  })
}

export function getUserById(users, userId) {
  const user = users.find((item) => item.id === userId)
  if (!user) throw new Error('Usuario no encontrado')
  return user
}

export function getUserIndexById(users, userId) {
  const index = users.findIndex((item) => item.id === userId)
  if (index === -1) throw new Error('Usuario no encontrado')
  return index
}

export function getUserByNickName(users, nick) {
  const user = users.find((item) => item.nick === nick)
  if (!user) throw new Error('Usuario no encontrado')
  return user
}

export function getModuleByCode(modules, moduleCode) {
  const module = modules.find((item) => item.code === moduleCode)
  if (!module) throw new Error('Módulo no encontrado')
  return module
}
