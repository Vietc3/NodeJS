const admin = require('firebase-admin');
const serviceAccount = require('./ServiceAccountKey.json');
const firebase = require('firebase');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
  apiKey: "AIzaSyAPObQJdseagbcjOP_Q_L3zJ5FgEZxkmRw",
  authDomain: "ohtask-aitt.firebaseapp.com",
  databaseURL: "https://ohtask-aitt.firebaseio.com",
  projectId: "ohtask-aitt",
  storageBucket: "ohtask-aitt.appspot.com",
  messagingSenderId: "382244442838",
  appId: "1:382244442838:web:2382d809483a0153"
};

firebase.initializeApp(firebaseConfig);

exports.admin = admin;
exports.auth = admin.auth();
exports.firebase = firebase;
