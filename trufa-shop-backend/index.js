require('dotenv').config({ path: '../.env.homologacao' })
console.log('Loading server, ambiente da api', process.env.GN_ENV)

const express = require('express')
const cors = require('cors')
const { saveOrder } = require('./lib/spreadsheet')
const { createPixCharge } = require('./lib/pix')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
	res.send({
		ok: true,
	})
})

app.post('/create-order', async (req, res) => {
	const pixCharge = await createPixCharge()
	const { qrcode, cobranca } = pixCharge
	const order = { ...req.body, id: cobranca.txid }
	await saveOrder(order)
	res.send({ ok: 1, qrcode, cobranca })
})

app.listen(3001, (err) => {
	if (err) {
		console.log('TrufaShop - Error loading server', err)
	} else {
		console.log('TrufaShop - Server online')
	}
})
