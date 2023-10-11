const User = require('../models/user')
const jwt = require('jsonwebtoken')

const authentificationMid = async (req, res, next) => {
	const { token } = req.cookies
	if (!token) {
		return res.status(400).json({ message: 'Giriş yapmalısınız' })
	}
	const decode = jwt.verify(token, 'secrettoken')

	if (!decode) {
		return res.status(400).json({ message: 'Giriş tokeni geçersizdir' })
	}
	req.user = await User.findById(decode.id)
	next()
}

const roleChecked = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(400).json({ message: 'Bu işlemi yapmaya yetkiniz yok' })
		}
		next()
	}
}

module.exports = { authentificationMid, roleChecked }
