const mongoose = require('mongoose');

const artigoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    imagem: {
        type: String,
        required: true
    },
    texto: {
        type: String
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
})

module.exports = mongoose.model("Artigo", artigoSchema);