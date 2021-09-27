require('dotenv').config({ path: '../.env.homologacao' })
console.log('Loading dev server')
console.log('Ambiente da api', process.env.GN_ENV)

const app = require('./app')

app.listen(3001, (err) => {
	if (err) {
		console.log('TrufaShop - Error loading server', err)
	} else {
		console.log('TrufaShop - Server online')
	}
})
