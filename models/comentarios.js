const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comentario: {
        type: String,
    },
    nome: {
        type: String,
    },
    dia: {
        type: String
    },
    mes: {
        type: String
    },
    ano: {
        type: String
    },
    horario: {
        type: String
    },
    idpost: {
        type: String
    }
})

module.exports = mongoose.model("Comment", commentSchema);