const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings');
const mongo_uri = `mongodb://${settings.database.host}:${settings.database.port}`;
const bcrypt = require('bcrypt');

const saltRounds = 10;

const user = {
  username: 'adam',
  password: 'password'
};

MongoClient.connect(mongo_uri, { useNewUrlParser: true })
.then(client => {
  const db = client.db('project');
  const collection = db.collection('users');
  bcrypt.genSalt(saltRounds, (error, salt) => {
    bcrypt.hash(user.password, salt, (error, hash) => {
      user.password = hash;
      collection.insertOne(user)
        .then(() => console.log('User inserted'))
        .catch(error => console.error(error));
    });
  });
}).catch(error => console.error(error));