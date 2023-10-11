const product = require('../models/product')
const Product = require('../models/product')
const productFilter = require('../utils/productFilter')
const cloudinary = require('cloudinary').v2
const getAllProduct = async (req, res, next) => {
	const skipResults = 10
	const productFilter = new productFilter(Product.find(), req.query).search().pagintion().filter()
	const products = await productFilter.query
	res.status(200).json({ products })
}

const createProduct = async (req, res, next) => {
	let images = []
	if (typeof req.body.images === 'string') {
		images.push(req.body.images)
	} else {
		images = req.body.images
	}
	let AllImages = []
	for (let i = 0; i < images.length; i++) {
		const result = await cloudinary.uploader.upload(images[i], {
			folder: 'products'
		})
		AllImages.push({
			public_id: result.public_id,
			url: result.secure_url
		})
	}
	req.body.images = AllImages
	const products = await Product.create(req.body)
	res.status(201).json({ products })
}

const deleteProduct = async (req, res, next) => {
	const products = await Product.findById(req.params.id)
	for (let i = 0; i < products.images.length; i++) {
		await cloudinary.uploader.destroy(products.images[i].public_id)
	}
	await products.remove()
	res.status(201).json({ message: 'ürürn başarıyla silindi' })
}

const updateProduct = async (req, res, next) => {
	let images = []
	if (typeof req.body.images === 'string') {
		images.push(req.body.images)
	} else {
		images = req.body.images
	}
	if (images !== undefined) {
		for (let i = 0; i < products.images.length; i++) {
			await cloudinary.uploader.destroy(products.images[i].public_id)
		}
	}

	let AllImages = []
	for (let i = 0; i < images.length; i++) {
		const result = await cloudinary.uploader.upload(images[i], {
			folder: 'products'
		})
		AllImages.push({
			public_id: result.public_id,
			url: result.secure_url
		})
	}
	req.body.images = AllImages
	req.body.user = req.user._id
	const products = await Product.findById(req.params.id)
	product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
	res.status(200).json({ products })
}
const detailProduct = async (req, res, next) => {
	const products = await Product.findById(req.params.id)
	res.status(200).json({ products })
}
const createReview = async (req, res, next) => {
	const { rating, comment, productId } = req.body
	const review = {
		user: req.user._id,
		name: req.user.name,
		comment,
		rating: Number(rating)
	}
	const product = await Product.findById(productId)
	product.reviews.push(review)
	let avg = 0
	product.reviews.forEach((r) => {
		avg += r.rating
	})
	product.rating = avg / product.reviews.length
	await product.save({ validateBeforeSave: false })
	res.status(200).json({ message: 'Review added' })
}

const isAdminProduct = async (req, res, next) => {
	const product = await Product.find()
	res.status(200).json({ product })
	next()
}

module.exports = {
	getAllProduct,
	createProduct,
	deleteProduct,
	updateProduct,
	detailProduct,
	createReview,
	isAdminProduct
}
