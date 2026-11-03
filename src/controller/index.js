import Books from '../model/books.class.js'
import Modules from '../model/modules.class.js'
import Users from '../model/users.class.js'
import View from '../view/index.js'

export default class Controller {
  constructor() {
    this.books = new Books()
    this.modules = new Modules()
    this.users = new Users()
    this.view = new View()
  }

  async init() {
    try {
      await Promise.all([
        this.books.populate(),
        this.modules.populate(),
        this.users.populate(),
      ])

      this.view.renderUsers(this.users.data)
      this.view.renderModules(this.modules.data)
      this.view.renderBooks(this.books.data, this.modules.data)
      this.view.bindSubmitBook((bookData) => this.handleSubmitBook(bookData))
      this.view.bindRemoveBook((bookId) => this.handleRemoveBook(bookId))
      return true
    } catch (error) {
      this.view.showMessage('error', `Error cargando los datos: ${error.message}`)
      return false
    }
  }

  async handleSubmitBook(bookData = this.view.getBookData()) {
    try {
      const book = await this.books.addBook(bookData)
      this.view.renderBook(book, this.modules.data)
      this.view.showMessage('info', 'Libro añadido correctamente')
      this.view.resetForm()
      return book
    } catch (error) {
      this.view.showMessage('error', `Error añadiendo el libro: ${error.message}`)
      return null
    }
  }

  async handleRemoveBook(id) {
    try {
      await this.books.removeBook(Number(id))
      this.view.removeBook(id)
      this.view.showMessage('info', 'Libro eliminado correctamente')
      return true
    } catch (error) {
      this.view.showMessage('error', `Error eliminando el libro: ${error.message}`)
      return false
    }
  }
}
