const express = require('express');

const { Router } = require('express');
const router = Router();

const multer = require('multer');
const { normalize } = require('path');
const upload = multer();

const daoMemoria = require('./src/DAO/daoMemoriaProductos.js');
const classProductos = new daoMemoria();

const mensajesDaoMongo = require('./src/DAO/daoMongoMensajes.js');
const classMsgs = new mensajesDaoMongo();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Socket.io
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});

app.set('view engine', 'ejs');

app.use('/api/productos', router);

app.get('/', async (req, res) => {
  try {
    const prods = await classProductos.getAll();
    res.render('pages/productos', { products: prods });
  } catch (err) {
    console.log(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const prods = await classProductos.getAll();
    console.log(prods);
    res.render('pages/productos', { products: prods });
  } catch (err) {
    console.log(err);
  }
});

router.post('/form', upload.none(), (req, res) => {
  try {
    const body = req.body;
    classProductos.save(body);
    if (body) {
    } else {
      res.json({ error: true, msg: 'Producto no agregado' });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get('/test', async (req, res) => {
  try {
    const prods = await classProductos.getAll();

    res.render('pages/productos', { products: prods });
  } catch (err) {
    console.log(err);
  }
});

io.on('connection', async (socket) => {
  console.log('Usuario conectado');

  socket.on('msg', async (data) => {
    let fecha = new Date();
    /* email: data.email,
      mensaje: data.mensaje,
      fecha: fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear(),
      hora: fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds(), */
    const msg = {
      author: {
        id: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        edad: data.edad,
        alias: data.alias,
        avatar: data.avatar,
      },
      text: {
        mensaje: data.mensaje,
        fecha: fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear(),
        hora: fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds(),
      },
    };

    classMsgs.save(msg);

    const user = new schema.Entity('author');
    const mensaje = new schema.Entity('mensajes');
    const chat = new schema.Entity('chat', {
      author: user,
      mensaje: mensaje,
    });
    const normalizado = normalize(msg, chat);
    console.log(normalizado);
    io.sockets.emit('msg-list', { normalizado: normalizado, schema: chat });
  });

  socket.on('sendTable', async (data) => {
    classProductos.save(data);

    try {
      const productos = await classProductos.getAll();
      socket.emit('prods', productos);
    } catch (err) {
      console.log(err);
    }
  });
});
