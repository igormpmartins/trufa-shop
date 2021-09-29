require('dotenv').config({ path: '../.env.producao' })
console.log('Loading https server')
console.log('Ambiente da api', process.env.GN_ENV)

const https = require('https')
const fs = require('fs')
const app = require('./app')
const { createWebHook } = require('./lib/pix')

const options = {
	//tls
	key: fs.readFileSync(process.env.KEY_PATH),
	cert: fs.readFileSync(process.env.CERT_PATH),

	//mtls
	ca: fs.readFileSync(process.env.GN_CA),
	minVersion: 'TLSv1.2',
	requestCert: true,
	rejectUnauthorized: false,
}

//online, https
const server = https.createServer(options, app)
server.listen(443, () => {
	console.log('Production Server Online')
	console.log('Creating webhook')
	createWebHook().then((res) => {
		console.log('Webhook created!', res)
	})
})
