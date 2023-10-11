const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cloudinary = require('cloudinary').v2
const cripto = require('crypto')
const nodeMailer = require('nodemailer')
const registerUser = async (req, res) => {
	const avatar = await cloudinary.uploader.upload(req.body.avatar, {
		folder: 'avatars',
		width: 150,
		crop: 'scale'
	})

	const { name, email, password } = req.body
	const user = await User.findOne({ email })
	if (user) {
		return res.status(400).json({ message: 'BÖYLE BİR KULLANICI ZATEN VAR' })
	}
	const hashPassword = await bcrypt.hash(password, 12)
	if (password.length < 6) {
		return res.status(400).json({ message: 'ŞİFRE EN AZ 6 KARAKTER OLMALI' })
	}

	const newUser = await User.create({
		name,
		email,
		password: hashPassword,
		avatar: { public_id: avatar.public_id, url: avatar.secure_url }
	})

	const token = jwt.sign({ id: newUser._id }, 'secrettoken', { expiresIn: '1h' })

	const cookieOptions = {
		expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
		httpOnly: true
	}
	res.cookie('token', token, cookieOptions)
	res.status(201).json({ newUser, token })
}

const loginUser = async (req, res) => {
	const { email, password } = req.body
	const user = await user.findOne({ email })
	if (!user) {
		return res.status(400).json({ message: 'BÖYLE BİR KULLANICI YOK' })
	}
	const comparePassword = await bcrypt.compare(password, user.password)

	if (!comparePassword) {
		return res.status(400).json({ message: 'ŞİFRE HATALI' })
	}

	const token = jwt.sign({ id: user._id }, 'secrettoken', { expiresIn: '1h' })

	const cookieOptions = {
		expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
		httpOnly: true
	}
	res.cookie('token', token, cookieOptions)
	res.status(200).json({ user, token })
}

const logout = async (req, res) => {
	const cookieoptions = {
		expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
		httpOnly: true
	}
	res.status(200).cookie('token', null, cookieoptions).json({ message: 'ÇIKIŞ YAPILDI' })
}

const forgotPassword = async (req, res) => {
	const user = await User.findOne({ email: req.body.email })
	if (!user) {
		return res.status(400).json({ message: 'BÖYLE BİR KULLANICI YOK' })
	}
	const resetToken = crypto.getRandomValues(20).toString('hex')
	user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	user.resetPasswordExpire = newDate(Date.now() + 30 * 60 * 1000)
	await user.save({ validateBeforeSave: false })
	const passwordUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`
	const message = `Şifrenizi sıfırlamak için lütfen aşağıdaki linke tıklayınız\n\n${passwordUrl}\n\nBu linke 30 dakika içinde tıklamazsanız şifre sıfırlama isteğiniz iptal olacaktır`
	try {
		const transporter = nodemailer.createTransport({
			port: 465,
			service: 'gmail',
			host: process.env.SMTP_HOST,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD
			},
			secure: true
		})
		const mailData = {
			from: process.env.SMTP_USER,
			to: req.body.email,
			subject: 'Şifre Sıfırlama',
			text: message
		}
		await transporter.sendMail(mailData)
		res.status(200).json({ message: 'MAİL GÖNDERİLDİ KONTROL EDİN ' })
	} catch (error) {
		user.resetPasswordToken = undefined
		user.resetPasswordExpire = undefined
		await user.save({ validateBeforeSave: false })
		return res.status(500).json({ message: 'MAİL GÖNDERİLEMEDİ' })
	}
}

const resetPassword = async (req, res) => {
	const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
	const user = await User.findOnoe({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() }
	})

	if (!user) {
		return res.status(400).json({ message: 'Geçersiz token' })
	}
	user.password = req.body.password
	user.resetPasswordToken = undefined
	user.resetPasswordExpire = undefined
	await user.save()

	const token = jwt.sign({ id: user._id }, 'secrettoken', { expiresIn: '1h' })

	const cookieOptions = {
		httpOnly: true,
		expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
	}

	res.status(200).cookie('token', token, cookieOptions).json({
		user,
		token
	})
}

const userDetail = async (req, res, next) => {
	const user = await User.findById(req.params.id)
	res.status(200).json({ user })
}

module.exports = {
	registerUser,
	loginUser,
	forgotPassword,
	resetPassword,
	logout,
	userDetail
}
