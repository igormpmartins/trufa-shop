const express = require('express')
const cors = require('cors')

const { saveOrder, updateOrder, orderStatus } = require('./lib/spreadsheet')
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

app.post('/webhook/pix*', async (req, res) => {
	console.log('webhook received!')
	console.log(req.body)
	if (!req.client.authorized) {
		return res.status(401).send('Invalid client certificate!')
	}
	const { pix } = req.body

	if (pix) {
		for await (const order of pix) {
			await updateOrder(order.txid, orderStatus.PAGO_PIX)
		}
	}

	res.send({ ok: true })
})

/*
app.listen(3001, (err) => {
	if (err) {
		console.log('TrufaShop - Error loading server', err)
	} else {
		console.log('TrufaShop - Server online')
	}
})
*/

module.exports = app
