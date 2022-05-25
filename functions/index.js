const functions = require("firebase-functions");
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore().collection("users");

const app = express();

const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

const corsOptions = {
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

//realiza a operação de create

app.post('/', async (req, res) => {
    const newUser = {
        id: req.body.id,
        name: req.body.name,
        age: req.body.age,
        phone: req.body.phone
    }
    await db.add(newUser)
        .then(() => {
            return res.sendStatus(200);
        })
})

//disponibiliza o conteúdo para a operação de read

app.get('/', async (req, res) => {
    await db.get()
        .then((docs) => {
            let users = [];
            docs.forEach((doc) => {
                users.push({
                    id: doc.data().id,
                    name: doc.data().name,
                    age: doc.data().age,
                    phone: doc.data().phone
                })
            })
            return res.send(users);
        })
})

//realiza a operação de update

app.put('/', async (req, res) => {
    await db.get()
        .then((docs) => {
            docs.forEach((doc) => {
                if (doc.data().id == req.body.id) {
                    db.doc(doc.id).update({
                        id: req.body.id,
                        name: req.body.name,
                        age: req.body.age,
                        phone: req.body.phone
                    });
                }
            })
            return res.sendStatus(200);
        })
})

//realiza a operação de delete

app.delete('/', async (req, res) => {
    await db.get()
        .then((docs) => {
            let users = [];
            docs.forEach((doc) => {
                doc.data().id == req.body.id ? doc.ref.delete() : 1;
            })
            return res.sendStatus(200);
        })    
})

//rota padrão para resposta 404

app.use((req, res) => {
    res.status(404);
    res.send("página não encontrada!");
})

exports.app = functions.https.onRequest(app);