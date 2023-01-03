const prodTable = document.getElementById('productos__table');

const mostrarProds = () => {
  fetch('http://localhost:8080/api/productos/test')
    .then((response) => response.json())
    .then((data) =>
      data.forEach((data) => {
        let prod = document.createElement('tr');
        prod.innerHTML += `
        <td>${data.name}</td>
        <td>${data.price}</td>
        <td><img src="${data.thumbnail}"></td>`;

        prodTable.append(prod);
      })
    );
};

mostrarProds();

const socket = io();
socket.on('connect', () => {
  console.log('me conecte!');
});

function sendMsg() {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const edad = document.getElementById('edad').value;
  const avatar = document.getElementById('avatar').value;
  const email = document.getElementById('email').value;
  const msg = document.getElementById('msg').value;
  socket.emit('msg', { nombre: nombre, apellido: apellido, edad: edad, avatar: avatar, email: email, mensaje: msg });
}

const schema = normalizr.schema;
const denormalize = normalizr.denormalize;
const authorSchema = new schema.Entity('authors');

socket.on('msg-list', (data) => {
  let mensaje = document.getElementById('messages');
  mensaje.innerHTML = ``;
  console.log(data);
  const user = new normalizr.schema.Entity('author');
  const mensajes = new normalizr.schema.Entity('mensajes');
  const chat = new normalizr.schema.Entity('chat', {
    author: user,
    mensaje: mensajes,
  });
  const normalizado = data.normalizado;

  const desnormalizado = denormalize(normalizado, chat, normalizado.entities);
  desnormalizado.forEach((obj) => {
    let html = '';

    html = `
    <div class="message">
      <p class="message__email">${obj.author.email}</p>
      <p class="message__date">fecha: ${obj.text.fecha} hora:${obj.text.hora}</p>
      <p class="message__msg">dijo: ${obj.text.mensaje}</p>
    </div><br>
    `;
    mensaje.innerHTML += html;
  });
});

function sendTable() {
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const thumbnail = document.getElementById('thumbnail').value;
  socket.emit('sendTable', { name: name, price: price, thumbnail: thumbnail });
}

socket.on('prods', (data) => {
  let tabla = document.getElementById('prods__table');
  tabla.innerHTML = ``;
  let html = ` 
    <TR>
      <TD>Nombre</TD> <TD>precio</TD> <TD>Imagen</TD>
    </TR>`;
  data.forEach((item) => {
    html += `       
      <TR class="prods__item">
        <TD class="prods__item">${item.name}</TD> <TD class="prods__item">$${item.price}</TD> <TD class="prods__item"><img class="prods__img"src="${item.thumbnail}"></TD>
      </TR>
      `;
  });
  tabla.innerHTML += html;
});
