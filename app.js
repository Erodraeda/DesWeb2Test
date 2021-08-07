const express = require('express');
const app = express();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Artigo = require('./models/artigo');
const Comentario = require('./models/comentarios');

mongoose.connect('mongodb://localhost:27017/dbProva', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Database connected\n---------------");
})
.catch(err => {
    console.log("Failed to connect to Database");
    console.log(err);
})

const path = require('path');
const comentarios = require('./models/comentarios');

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));

app.use(session({secret:'account', resave: false, saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
}

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.get('/administracao', isLoggedIn, async (req, res) => {
    const artigos = await Artigo.find({});
    res.render('administracao', {artigos});
})

app.get('/cadastroUsuario', (req, res) => {
    res.render('cadastroUsuario');
})

app.post('/cadastroUsuario', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = new User({username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
        })
    } catch (e) {
        console.log(e);
        res.redirect("/cadastroUsuario");
    }

    res.redirect('/administracao');
    
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/administracao"
}))

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/');
})

app.get('/artigos/new', isLoggedIn, (req, res) => {
    res.render('novoArtigo');
})

app.post('/artigo', isLoggedIn, async (req, res) => {
    const novoArtigo = new Artigo(req.body);
    const data = new Date();
    const id = novoArtigo._id;
    await novoArtigo.save();
    await Artigo.findByIdAndUpdate(id, {
        "dia": data.getDate(),
        "mes": data.getMonth(),
        "ano": data.getFullYear()
    },
        function(er, res) {
        if (er) {
            console.log(er);
        } else {
            console.log(res);
        }
    });
    res.redirect('/');
})

app.post('/comentario', isLoggedIn, async (req, res) => {
    const novoComentario = new Comentario(req.body);
    const data = new Date();
    var horas = data.getHours();
    horas = ("0" + horas).slice(-2);
    var minutos = data.getMinutes();
    minutos = ("0" + minutos).slice(-2);
    const horario = horas + "h" + minutos;
    const id = novoComentario._id;
    const idPost = req.body.idpost;
    await novoComentario.save({});
    await Comentario.findByIdAndUpdate(id, {
        "dia": data.getDate(),
        "mes": data.getMonth(),
        "ano": data.getFullYear(),
        "horario": horario,
        "idpost": idPost
    },
        function(er, res) {
        if (er) {
            console.log(er);
        } else {
            console.log(res);
        }
    });
    res.redirect('/artigos/' + idPost);
})

app.get('/artigos/:id', async (req, res) => {
    const {id} = req.params;
    const artigo = await Artigo.findById(id);
    const comentarios = await Comentario.find({idpost: id});
    res.render('artigo', {artigo, comentarios});
})

app.get('/artigos/:id/edit', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const artigo = await Artigo.findById(id);
    res.render('artigoedit', {artigo});
})

app.patch('/artigos/:id', isLoggedIn, async (req, res) => {
    const artigoAtt = Artigo(req.body);
    const {id} = req.params;
    await Artigo.findByIdAndUpdate(id, {
        "titulo": artigoAtt.titulo,
        "imagem": artigoAtt.imagem,
        "texto": artigoAtt.texto
    },
        function(er, res) {
        if (er) {
            console.log(er);
        } else {
            console.log(res);
        }
    });
    res.redirect('/artigos/' + id);
})

app.delete('/artigos/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await Artigo.findByIdAndDelete(id, {},
        function(er, res) {
        if (er) {
            console.log(er);
        } else {
            console.log(res);
        }
    });
    await Comentario.deleteMany({idpost: id},
        function(er, res) {
        if (er) {
            console.log(er);
        } else {
            console.log(res);
        }
    });
    res.redirect('/artigos');
})

app.get('/', (req, res) => {
    res.redirect('/artigos');
})

app.get('/artigos', async (req, res) => {
    const artigos = await Artigo.find({});
    res.render('artigos', {artigos});
})

app.listen(3000, () => {
    console.log("--------\nserver up\n--------");
});