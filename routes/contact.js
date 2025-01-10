const express = require('express');
const Contact = require('../models/Contact');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Both name and phone are required.' });
  }

  try {
    const existingContact = await Contact.findOne({ name, phone });

    if (existingContact) {
      return res.status(400).json({ message: 'Contact with the same name and phone already exists.' });
    }

    const newContact = new Contact({
      name,
      phone
    });

    await newContact.save();
    res.status(200).json({ message: 'Contact saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving contact', error });
  }
});


router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();  
    res.status(200).json(contacts);       
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
});

router.put('/contact/:id', async (req, res) => {
  const { name, phone } = req.body;
  const contactId = req.params.id;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Both name and phone are required to update.' });
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { name, phone },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(200).json({ message: 'Contact updated successfully!', updatedContact });
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error });
  }
});

router.delete('/contact/:id', async (req, res) => {
  const contactId = req.params.id;

  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.status(200).json({ message: 'Contact deleted successfully!', deletedContact });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error });
  }
});
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await Contact.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


