const productFilter = {
	constructor(query, queryString) {
		this.query = query
		this.queryString = queryString
	},
	search() {
		const keyword = this.queryString.keyword
			? {
					name: {
						$regex: this.queryString.keyword,
						$options: 'i'
					}
			  }
			: {}
		console.log(keyword)
		this.query = this.query.find({ ...keyword })
		return this
	},
	filter() {
		const queryCopy = { ...this.queryString }
		// Removing fields from the query
		const removeFields = ['keyword', 'limit', 'page']
		removeFields.forEach((el) => delete queryCopy[el])
		console.log(queryCopy)
		// Advance filter for price, ratings etc
		let queryStr = JSON.stringify(queryCopy)
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)
		console.log(queryStr)
		this.query = this.query.find(JSON.parse(queryStr))
		return this
	},
	pagination() {
		const page = parseInt(this.queryString.page) || 1
		const limit = parseInt(this.queryString.limit) || 10
		const skipResults = (page - 1) * limit
		this.query = this.query.skip(skipResults).limit(limit)
		return this
	}
}

module.exports = productFilter
