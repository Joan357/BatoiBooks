import './style.css'
import Books from './model/books.class.js'
import Users from './model/users.class.js'
import Modules from './model/modules.class.js'

const books = new Books()
const users = new Users()
const modules = new Modules()

async function startApp() {
  await Promise.all([books.populate(), users.populate(), modules.populate()])

  console.log('Libros del módulo 5021:', books.booksFromModule('5021'))
  console.log('Libros nuevos:', books.booksWithStatus('new'))
  document.querySelector('#app').innerHTML = `
    <header>
      <img src="/logoBatoi.png" alt="Logo de Batoi" />
      <h1>BatoiBooks</h1>
    </header>
    <p>Abre la consola para ver el funcionamiento de la aplicación.</p>
  `
}

startApp().catch((error) => {
  console.error('No se pudo iniciar BatoiBooks:', error)
  document.querySelector('#app').innerHTML = '<p>No se pudo conectar con la API.</p>'
})
