const mongoose = require('mongoose');

const mensajesSchema = new mongoose.Schema({
  author: {
    id: { type: Number, require: true },
    nombre: { type: String, require: true },
    apellido: { type: String, require: true },
    edad: { type: Number, require: true },
    alias: { type: String, require: true },
    avatar: { type: String, require: true },
  },
  text: { type: String, require: true },
});
const mensajes = mongoose.model('mensajes', mensajesSchema);
module.exports = mensajes;
