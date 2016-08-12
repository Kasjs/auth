module.exports = {
	MONGO_URI: process.env.MONGO_URI || 'localhost',
  TOKEN_SECRET: process.env.TOKEN_SECRET || '496c59a0260a0c999ae39eccdff5ff03_rss',

  // OAuth 2.0
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '496c59a0260a0c999ae39eccdff5ff03',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'pGT_4I5yjrhPGyohUyTEKsqe',
}