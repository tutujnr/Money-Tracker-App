const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const mongoURI = 'mongodb://localhost:27017/Langat';

mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const expenseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true }
});
const Expense = mongoose.model('Expense', expenseSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/expenses', async (req, res) => {
    try {
      const expenses = await Expense.find();
      res.json(expenses);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
app.post('/expenses', async (req, res) => {
    try {
        const { name, amount } = req.body;
        
        if (!name || !amount) {
            return res.status(400).json({ error: 'Expense name and amount are required' });
        }

        const newExpense = new Expense({ name, amount });
        await newExpense.save();

        console.log('Expense added:', newExpense);
        res.redirect('/')
    } catch (err) {
        console.error('Error saving expense:', err);
        res.status(500).json({ error: 'Failed to save expense' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});