import data from './services/datos.js'


function getBookById(id) {
  return data.books.find(book => book.id === id)
}


function getBookIndexById(id) {
  return data.books.findIndex(book => book.id === id)
}


function bookExists(id) {
  return data.books.some(book => book.id === id)
}


function booksFromUser(userId) {
  return data.books.filter(book => book.userId === userId)
}


function booksFromModule(moduleCode) {
  return data.books.filter(book => book.moduleCode === moduleCode)
}


function booksCheeperThan(price) {
  return data.books.filter(book => book.price < price)
}


function booksWithStatus(status) {
  return data.books.filter(book => book.status === status)
}


function averagePriceOfBooks() {
  if (data.books.length === 0) {
    return 0
  }

  const total = data.books.reduce((total, book) => total + book.price, 0)

  return total / data.books.length
}


function booksOfTypeNotes() {
  return data.books.filter(book => book.publisher === 'Apunts')
}


function booksNotSold() {
  return data.books.filter(book => book.soldDate === '')
}


function incrementPriceOfbooks(percent = 10) {
  return data.books.map(book => {
    return {
      ...book,
      price: book.price + book.price * percent / 100
    }
  })
}


function getUserById(id) {
  return data.users.find(user => user.id === id)
}


function getUserIndexById(id) {
  return data.users.findIndex(user => user.id === id)
}


function getUserByNickName(nick) {
  return data.users.find(user => user.nick === nick)
}


function getModuleByCode(code) {
  return data.modules.find(module => module.code === code)
}


export {
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
}