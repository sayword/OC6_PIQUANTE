const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const stuffCtrl = require('../controllers/stuff');

//Routes 
router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/', auth, multer, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.post('/:id/like', auth, stuffCtrl.likeThing);
module.exports = router;