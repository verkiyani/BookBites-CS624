// backend/seed.js
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb+srv://tyleradams918:NHnD4XF1&Pcm3S@bookdatabase.dysuttl.mongodb.net'
const DB_NAME = 'test';
const books = [];

MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(async client => {
    const db = client.db(DB_NAME);
    const booksCollection = db.collection('test');
    await booksCollection.deleteMany({});
    await booksCollection.insertMany(books);
    console.log('Seeded books!');
    client.close();
  })
  .catch(err => console.error('MongoDB connection error:', err));