const monngoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, minlength: 6 },
		avatar: { public_id: { type: String, required: true }, url: { type: String, required: true } },
		role: { type: String, default: 'user', required: true },
		resetPasswordToken: { type: String },
		resetPasswordExpire: { type: Date }
	},
	{ timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
