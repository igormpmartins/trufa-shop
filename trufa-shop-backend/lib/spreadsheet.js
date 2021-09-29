require('dotenv').config({ path: '../.env.homologacao' })
const { GoogleSpreadsheet } = require('google-spreadsheet')
const credentials = require('../../credentials.json')

const doc = new GoogleSpreadsheet(process.env.SHEET_ID)

const orderStatus = {
	AGUARDANDO_PAG: 'Aguardando Pagamento',
	PAGO_PIX: 'Pago com Pix',
}

const saveOrder = async (order) => {
	await doc.useServiceAccountAuth(credentials)
	await doc.loadInfo()

	const sheet = await doc.sheetsByIndex[1]

	console.log(sheet.title)

	console.log(order)

	const orderId = order.id
	const status = orderStatus.AGUARDANDO_PAG

	const total = order.items.reduce(
		(prev, curr) => prev + curr.qty * curr.price,
		0
	)

	const rows = order.items.map((item) => {
		return {
			Pedido: orderId,
			Cliente: order.nome,
			Telefone: order.telefone,
			CPF: order.cpf,
			Produto: item.name,
			Quantidade: item.qty,
			Preco: item.price,
			Subtotal: item.qty * item.price,
			Total: total,
			Status: status,
		}
	})

	await sheet.addRows(rows)
}

const updateOrder = async (orderId, status) => {
	await doc.useServiceAccountAuth(credentials)
	await doc.loadInfo()

	const sheet = await doc.sheetsByIndex[1]
	const rows = await sheet.getRows()

	for await (const row of rows) {
		if (!row.Pedido) {
			break
		}

		if (row.Pedido === orderId.toString()) {
			row.Status = status
			await row.save()
		}
	}
}

module.exports = {
	saveOrder,
	updateOrder,
	orderStatus,
}
