const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();

const app = express();

app.use(cors());

app.get('/getClients', async (req, res, next) => {
    const query = admin.firestore().collection('clients');
    const snapshot = await query.get();
    const clients = snapshot.docs.map(doc => doc.data());
    res.send(clients);
});

exports.app = functions.region('europe-west3').https.onRequest(app);
