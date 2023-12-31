const monngoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		stock: { type: Number, required: true, default: 1 },
		category: { type: String, required: true },
		rating: { type: String, required: true, default: 0 },
		images: [{ public_id: { type: String, required: true }, url: { type: String, required: true } }],
		user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
		reviews: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
				name: { type: String, required: true },
				rating: { type: Number, required: true },
				comment: { type: String, required: true }
			}
		]
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
