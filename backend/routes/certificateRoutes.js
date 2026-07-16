const express = require('express');
const router = express.Router();
const {
  verifyCertificate,
  getMyCertificates
} = require('../controllers/certificateController');

router.get('/verify/:certificateId', verifyCertificate);
router.get('/my', getMyCertificates);

module.exports = router;
