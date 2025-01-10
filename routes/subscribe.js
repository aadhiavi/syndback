const express = require('express');
const Subscribe = require('../models/Subscribe');
const { sendSubscribeEmail } = require('../config/mailer');
const router = express.Router();

router.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    try {
        const existingMail = await Subscribe.findOne({ email });
        if (existingMail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const newSubscribe = new Subscribe({ email })
        await newSubscribe.save();
        sendSubscribeEmail(email)
        res.status(200).json({ message: 'Email saved successfully!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error saving contact', error });
    }
})

module.exports = router