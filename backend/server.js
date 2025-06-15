require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI; 
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

// Delete a review by index
app.delete('/api/book/:id/review/:index', async (req, res) => {
  try {
    const { id, index } = req.params;
    const book = await booksCollection.findOne({ _id: new ObjectId(id) });
    if (!book || !Array.isArray(book.comments)) return res.status(404).json({ error: 'Not found' });
    book.comments.splice(Number(index), 1);
    await booksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { comments: book.comments } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Delete a discussion by index
app.delete('/api/book/:id/discussion/:index', async (req, res) => {
  try {
    const { id, index } = req.params;
    const book = await booksCollection.findOne({ _id: new ObjectId(id) });
    if (!book || !Array.isArray(book.discussions)) return res.status(404).json({ error: 'Not found' });
    book.discussions.splice(Number(index), 1);
    await booksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { discussions: book.discussions } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete discussion' });
  }
});

// Delete a quote by index
app.delete('/api/book/:id/quote/:index', async (req, res) => {
  try {
    const { id, index } = req.params;
    const book = await booksCollection.findOne({ _id: new ObjectId(id) });
    if (!book || !Array.isArray(book.quotes)) return res.status(404).json({ error: 'Not found' });
    book.quotes.splice(Number(index), 1);
    await booksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { quotes: book.quotes } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

// Delete a comment (review) by matching rating, comment, and date
app.delete('/api/book/:id/comments', async (req, res) => {
  try {
    const { rating, comment, date } = req.body;
    const result = await booksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $pull: { comments: { rating, comment, date } } }
    );
    if (result.modifiedCount === 0) return res.status(404).json({ error: 'Comment not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Delete a discussion by matching text and date
app.delete('/api/book/:id/discussion', async (req, res) => {
  try {
    const { text, date } = req.body;
    const result = await booksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $pull: { discussions: { text, date } } }
    );
    if (result.modifiedCount === 0) return res.status(404).json({ error: 'Discussion not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete discussion' });
  }
});

// Delete a quote by matching text, page, and date
app.delete('/api/book/:id/quote', async (req, res) => {
  try {
    const { text, page, date } = req.body;
    const result = await booksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $pull: { quotes: { text, page, date } } }
    );
    if (result.modifiedCount === 0) return res.status(404).json({ error: 'Quote not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});