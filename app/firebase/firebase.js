/*eslint-disable */
import Firebase from 'firebase';

class FirebaseAPI {
    constructor() {

        // Initialize Firebase
        const CONFIG = {
            apiKey: "AIzaSyCLGQiNZlU8UAx-dhjMtHSibKjGE0IB7xQ",
            authDomain: "imchat-e0143.firebaseapp.com",
            databaseURL: "https://imchat-e0143.firebaseio.com",
            storageBucket: "imchat-e0143.appspot.com",
            messagingSenderId: "65284431016"
        };

        this.firebase = Firebase.initializeApp(CONFIG);
        this.storage = this.firebase.storage().ref();
    }

    db() {
        return this.firebase.database();
    }

    ref(location) {
        let ref = null;

        if (location) {
            if (typeof location.once === 'function') {
                ref = location;
            }
            else if (typeof location === 'string') {
                ref = this.firebase.database().ref(location);
            } else {
                // throw new Error('Invalid "location" supplied to FirebaseAPI.ref!');
            }
        }

        return ref;
    }

    // REALTIME DATABASE
    // ************************************************
    set(path, payload, callback) {
        this.ref(path).set(payload).then(function() {
            callback && callback(payload);
        }, function(error) {
            console.log(error);
        });
    }

    push(path, payload, callback) {
        this.ref(path).push(payload).once('value').then(function(snapshot) {
            callback && callback(snapshot.val(), snapshot.key);
        }, function(error) {
            console.log(error);
        });
    }

    onChange(type, path, callback) {
        this.ref(path).on(type, function(childSnapshot, prevChildName) {
            // do something with the child
            callback(childSnapshot.val(), childSnapshot.key);
        });
    }

    onNewChange(type, path, callback) {
        this.ref(path).orderByChild('created').startAt(Date.now()).on(type, function(childSnapshot, prevChildName) {
            // do something with the child
            callback(childSnapshot.val());
        });
    }

    update() {

    }

    transaction() {

    }

    remove(path) {
        this.firebase.database().ref(path).remove().then((e) => {
        });
    }

    getData(location, callback, snapshotToDataFunc) {
        snapshotToDataFunc = snapshotToDataFunc || ((s) => s.val());
        this.ref(location).once('value').then((snapshot) => {
            callback(snapshotToDataFunc(snapshot));
        });
    }

    getList(location, callback, options = { inlineKey: 'id', childSnapshotToDataFunc: undefined }) {
        const snapshotToDataFunc = options.childSnapshotToDataFunc || ((s) => s.val());
        const snapshotToList = (snapshot) => {
            let list;
            list = [];
            snapshot.forEach((childSnapshot) => {
                const childObj = snapshotToDataFunc(childSnapshot);
                childObj[options.inlineKey] = childSnapshot.key;
                list.push(childObj)
            });
            return list;
        };
        return this.getData(location, callback, snapshotToList)
     }

    // AUTHENTICATION
    // ************************************************
    syncUser(onLogin, onLogout) {
        this.firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                // user.sendEmailVerification();
                console.log('signed in...', user);
                onLogin(user);
            } else {
                // No user is signed in.
                console.log('not signed in');
                onLogout();
            }
        });
    }

    createUser(email, password) {
        this.firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            console.log(error);
        });
    }

    signIn(email, password) {
        this.firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            console.log(error);
        });
    }

    signOut() {
        this.firebase.auth().signOut().then(function() {
            console.log('signed out!');
        }, function(error) {
            console.log(error);
        });
    }

    // STORAGE
    // ************************************************

    upload(fileName, path, file) {
        // Create a reference to 'file'
        const fileRef = this.storage.child(fileName);

        // Create a reference to 'images/mountains.jpg'
        const imagesRef = this.storage.child(`${ path }/${ fileName }`);

        // Upload the file to the path 'images/rivers.jpg'
        // We can use the 'name' property on the File API to get our file name
        const uploadTask = this.storage.child(`${ path }/${ fileName }`).put(file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // See below for more detail
        }, function(error) {
            // Handle unsuccessful uploads
            console.error(error);
        }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            const downloadURL = uploadTask.snapshot.downloadURL;
            console.log('success', downloadURL);
        });
    }
}

const FirebaseAPIInstance = new FirebaseAPI();

export default FirebaseAPIInstance;
/*eslint-enable */
