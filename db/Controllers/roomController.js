const database  = require('../dataBase')
const fireStore = database.firestore()

const getRoom = async (roomName) => {
    try {
        const room = await fireStore.collection('rooms').doc(roomName)
        const data = await room.get()
        if (data.empty) {
            return false 
        }
        return data.data()
    } catch (error) {
        console.log(error);
    }
}


const addRooms = async (rooms, name) => {
    try {
        let room = await fireStore.collection('rooms').doc(name).get()
        if (room.data()) {
            return
        }
        await fireStore.collection('rooms').doc(name).set(...rooms)
    } catch(error) {
        console.log(error);
    }
}

const updateRooms = async (roomName, userInfo, message, messageId) => {
    try {
        let query = await fireStore.collection('rooms').doc(roomName).get()
        let m = query.data().messages
        await fireStore.collection('rooms').doc(roomName).update({messages: [...m, {user: {...userInfo}, message, messageId}]})
    } catch (error) {
        console.log(error)
    }
}

const deleteRooms = async (roomName) => {
    try {
        await fireStore.collection('rooms').doc(roomName).delete()
    } catch (error) {
        console.log(error)
    }
}

module.exports = {getRoom, addRooms, updateRooms, deleteRooms}


