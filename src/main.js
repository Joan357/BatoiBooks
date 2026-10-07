import './style.css'
import data from './services/datos.js'
import Books from './model/books.class.js'
import Users from './model/users.class.js'
import Modules from './model/modules.class.js'

const books = new Books()
const users = new Users()
const modules = new Modules()

books.populate(data.books)
users.populate(data.users)
modules.populate(data.modules)

console.log('Libros del módulo 5021:', books.booksFromModule('5021'))
console.log('Libros nuevos:', books.booksWithStatus('new'))
console.log('Libros con un incremento del 10%:', books.incrementPriceOfbooks(0.1))
document.querySelector('#app').innerHTML = `
  <header>
    <img src="/logoBatoi.png" alt="Logo de Batoi" />
    <h1>BatoiBooks</h1>
  </header>
  <p>Abre la consola para ver el funcionamiento de la aplicación.</p>
`
