const express = require('express');
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
const Item = require('../models/Item');
const router = express.Router();
const MONGO_URI = process.env.MONGO_URI

router.post('/', async (req, res) => {
  try {
    const newItem = new Item(req.body.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  console.log(MONGO_URI)

  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {  
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, 
      {...req.body.body,
        createdAt: new Date()
      }, {
      new: true,
      runValidators: true,
    });
    console.log(updatedItem)

      res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  console.log("got delete ", req.params.id)
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;