module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{woff2,ttf,eot,woff,svg,css,js,jpg,ico,png,html,json,txt}'
	],
	swDest: 'dist/service-worker-js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};