const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();

const app = express();

app.use(cors());

app.get('/getClients', async (req, res, next) => {
    const ipAddress = req.headers['x-appengine-user-ip'] || req.header['x-forwarded-for'] || req.connection.remoteAddress;
    const timestamp = Date.now();

    const newClient = {
        timestamp: timestamp,
        ip: ipAddress,
    };

    await admin.firestore().collection('clients').add(newClient);

    const countQuery = await admin.firestore().collection('config').doc('0').get();
    const count = countQuery.get('visitorCount');

    const query = admin.firestore().collection('clients')
        .orderBy('timestamp', 'desc')
        .limit(10);

    const snapshot = await query.get();
    const clients = snapshot.docs.map(doc => doc.data());

    const visitorCount = count + 1;

    await admin.firestore().collection('config').doc('0').update({
        visitorCount,
    });

    res.send({clients, visitorCount});
});

exports.app = functions.region('europe-west3').https.onRequest(app);
