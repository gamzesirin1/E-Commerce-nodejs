const express = require('express')
const {
	getAllProduct,
	detailProduct,
	createProduct,
	deleteProduct,
	updateProduct,
	createReview,
	isAdminProduct
} = require('../controllers/products')
const { authentificationMid, roleChecked } = require('../middlewares/auth')
const router = express.Router()

router.get('/products', getAllProduct)
router.get('/admin/products', authentificationMid, roleChecked('admin'), isAdminProduct)
router.get('/products/:id', detailProduct)
router.post('/products/newProduct', authentificationMid, roleChecked('admin'), createProduct)
router.post('/products/newReview', authentificationMid, createReview)
router.delete('/products/:id', authentificationMid, roleChecked('admin'), deleteProduct)
router.put('/products/:id', authentificationMid, roleChecked('admin'), updateProduct)

module.exports = router
