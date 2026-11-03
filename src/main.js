import './style.css'
import Controller from './controller/index.js'

function renderPage() {
  document.querySelector('#app').innerHTML = `
    <header>
      <img src="/logoBatoi.png" alt="Logo de Batoi" />
      <h1>BatoiBooks</h1>
      <nav>
        <a href="#list">Ver Libros</a>
        <a href="#form">Añadir Libro</a>
        <a href="#about">Acerca de...</a>
      </nav>
    </header>

    <div id="messages"></div>

    <main>
      <section id="list">
        <h2>Libros</h2>
      </section>

      <section id="remove">
        <h2>Borrar libro</h2>
        <label for="remove-book-id">Id del libro:</label>
        <input id="remove-book-id" name="bookId" type="number" min="1" />
        <button id="remove-book-button" type="button">Borrar</button>
      </section>

      <section id="form">
        <h2>Añadir libro</h2>
        <form id="book-form">
          <label for="userId">Usuario:</label>
          <select id="userId" name="userId" required>
            <option value="">-Selecciona un usuario-</option>
          </select>
          <label for="moduleCode">Módulo:</label>
          <select id="moduleCode" name="moduleCode" required>
            <option value="">-Selecciona un módulo-</option>
          </select>
          <label for="publisher">Editorial:</label>
          <input id="publisher" name="publisher" required />
          <label for="price">Precio:</label>
          <input id="price" name="price" type="number" step="0.01" required />
          <label for="pages">Páginas:</label>
          <input id="pages" name="pages" type="number" required />
          <label for="photo">Foto:</label>
          <input id="photo" name="photo" type="text" />
          <label for="soldDate">Fecha de venta:</label>
          <input id="soldDate" name="soldDate" type="date" />
          <fieldset>
            <legend>Estado:</legend>
            <label><input type="radio" name="status" value="new" checked /> Nuevo</label>
            <label><input type="radio" name="status" value="good" /> Bueno</label>
            <label><input type="radio" name="status" value="bad" /> Malo</label>
          </fieldset>
          <label for="comments">Comentarios:</label>
          <textarea id="comments" name="comments"></textarea>
          <button type="submit">Añadir</button>
          <button type="reset">Reset</button>
        </form>
      </section>

      <section id="about">
        <h2>Acerca de...</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </section>
    </main>

    <footer>Juan Segura - DWEC</footer>
  `

  const myController = new Controller()
  myController.init()
}

document.addEventListener('DOMContentLoaded', renderPage)
