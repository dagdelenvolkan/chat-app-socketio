const firebase = require('firebase')
const firebaseConfig = require('./config')

const database = firebase.initializeApp(firebaseConfig)

module.exports = database