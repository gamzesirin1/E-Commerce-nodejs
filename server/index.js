const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const db = require('./config/db')
const product = require('./routes/product')
const user = require('./routes/user')
const cloudinary = require('cloudinary').v2
dotenv.config()

cloudinary.config({
	cloud_name: procces.env.CLOUD_NAME,
	api_key: procces.env.API_KEY,
	api_secret: procces.env.API_SECRET
})

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cookieParser())

app.get('/products', (req, res) => {
	res.status(200).json({ message: 'Hello products page!' })
})

app.use('/', product)
app.use('/', user)

db()
const port = 4000

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`)
})
