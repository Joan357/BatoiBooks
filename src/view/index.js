export default class View {
  constructor() {
    this.booksList = document.querySelector('#list')
    this.remove = document.querySelector('#remove')
    this.form = document.querySelector('#form')
    this.about = document.querySelector('#about')
    this.bookForm = document.querySelector('#book-form')
    this.userSelect = document.querySelector('#userId')
    this.moduleSelect = document.querySelector('#moduleCode')
    this.messages = document.querySelector('#messages')
    this.removeBookInput = document.querySelector('#remove-book-id')
    this.removeBookButton = document.querySelector('#remove-book-button')
  }

  renderUsers(users) {
    this.userSelect.innerHTML = '<option value="">-Selecciona un usuario-</option>'

    users.forEach((user) => {
      const option = document.createElement('option')
      option.value = user.id
      option.textContent = `${user.nick} (${user.id})`
      this.userSelect.append(option)
    })
  }

  renderModules(modules) {
    this.moduleSelect.innerHTML = '<option value="">-Selecciona un módulo-</option>'

    modules.forEach((module) => {
      const option = document.createElement('option')
      option.value = module.code
      option.textContent = `${module.cliteral} (${module.code})`
      this.moduleSelect.append(option)
    })
  }

  renderModuleOptions(modules) {
    this.renderModules(modules)
  }

  renderBooks(books, modules) {
    this.booksList.innerHTML = ''

    books.forEach((book) => {
      const module = modules.find((item) => item.code === book.moduleCode)
      this.renderBook(book, module)
    })
  }

  renderBook(book, moduleOrModules) {
    const module = Array.isArray(moduleOrModules)
      ? moduleOrModules.find((item) => item.code === book.moduleCode)
      : moduleOrModules
    const card = document.createElement('article')
    card.className = 'card'
    card.dataset.bookId = book.id

    const imageContainer = document.createElement('div')
    imageContainer.className = 'card-img'
    const image = document.createElement('img')
    image.src = book.photo || '/logoBatoi.png'
    image.alt = `Libro: ${book.id}`
    imageContainer.append(image)

    const body = document.createElement('div')
    body.className = 'card-body'

    const moduleTitle = document.createElement('h3')
    moduleTitle.textContent = `${module?.cliteral || book.moduleCode} (${book.id})`

    const publisher = document.createElement('h4')
    publisher.textContent = book.publisher

    const pages = document.createElement('p')
    pages.textContent = `${book.pages} páginas`

    const status = document.createElement('p')
    status.textContent = `Estado: ${book.status}`

    const sale = document.createElement('p')
    sale.textContent = book.soldDate
      ? `Vendido el ${this.formatDate(book.soldDate)}`
      : 'En venta'

    const comments = document.createElement('p')
    comments.textContent = book.comments

    const price = document.createElement('h4')
    price.textContent = `${Number(book.price).toFixed(2)} €`

    body.append(moduleTitle, publisher, pages, status, sale, comments, price)
    card.append(imageContainer, body)
    this.booksList.append(card)

    return card
  }

  removeBook(id) {
    const card = this.booksList.querySelector(`[data-book-id="${id}"]`)
    card?.remove()
  }

  showMessage(type, message) {
    const alert = document.createElement('div')
    alert.className = `tipo alert alert-${type} alert-dismissible`
    alert.setAttribute('role', 'alert')
    alert.textContent = message

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.textContent = 'x'
    closeButton.setAttribute('aria-label', 'Cerrar')
    closeButton.onclick = () => alert.remove()
    alert.append(closeButton)

    this.messages.append(alert)

    if (type !== 'error') {
      setTimeout(() => alert.remove(), 3000)
    }

    return alert
  }

  getBookData() {
    const formData = new FormData(this.bookForm)

    return {
      userId: Number(formData.get('userId')),
      moduleCode: formData.get('moduleCode'),
      publisher: formData.get('publisher').trim(),
      price: Number(formData.get('price')),
      pages: Number(formData.get('pages')),
      status: formData.get('status'),
      photo: formData.get('photo').trim(),
      comments: formData.get('comments').trim(),
      soldDate: formData.get('soldDate'),
    }
  }

  getBookFromForm() {
    return this.getBookData()
  }

  resetForm() {
    this.bookForm.reset()
  }

  bindSubmitBook(callback) {
    this.bookForm.addEventListener('submit', (event) => {
      event.preventDefault()

      if (this.bookForm.checkValidity()) {
        callback(this.getBookData())
      }
    })
  }

  bindRemoveBook(callback) {
    this.removeBookButton.addEventListener('click', () => {
      const id = Number(this.removeBookInput.value)

      if (!this.removeBookInput.value || !Number.isInteger(id) || id < 1) {
        this.showMessage('error', 'Indica una ID de libro válida')
        return
      }

      callback(id)
    })
  }

  formatDate(date) {
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
  }
}
