// backend/server.js
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://tyleradams918:NHnD4XF1&Pcm3S@bookdatabase.dysuttl.mongodb.net'; 
const DB_NAME = 'test';

let db, booksCollection;

MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    booksCollection = db.collection('popBooks');
    app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await booksCollection.find({}).toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get all data for a book (reviews, discussions, quotes)
app.get('/api/book/:id/all', async (req, res) => {
  try {
    const book = await booksCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({
      comments: book.comments || [],
      discussions: book.discussions || [],
      quotes: book.quotes || [],
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book data' });
  }
});

// Add a review
app.post('/api/book/:id/review', async (req, res) => {
  try {
    const { rating, comment, date } = req.body;
    await booksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { comments: { rating, comment, date } } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Add a discussion
app.post('/api/book/:id/discussion', async (req, res) => {
  try {
    const { text, date } = req.body;
    await booksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { discussions: { text, date } } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add discussion' });
  }
});

// Add a quote
app.post('/api/book/:id/quote', async (req, res) => {
  try {
    const { text, page, date } = req.body;
    await booksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { quotes: { text, page, date } } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add quote' });
  }
});