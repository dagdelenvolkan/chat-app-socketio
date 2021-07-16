const database  = require('../dataBase')
const fireStore = database.firestore()
const User = require('../models/user')


const addUser = async (userId, userName, messages) => {
    try {
        await fireStore.collection('users').doc().set({userId, userName, messages})
        console.log('Veriler eklendi');
    } catch(error) {
        console.log(error);
    }
}

module.exports = addUser