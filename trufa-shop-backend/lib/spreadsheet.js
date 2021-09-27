require('dotenv').config({ path: '../.env.homologacao' })
const { GoogleSpreadsheet } = require('google-spreadsheet')
const credentials = require('../../credentials.json')

const doc = new GoogleSpreadsheet(process.env.SHEET_ID)

const saveOrder = async (order) => {
	await doc.useServiceAccountAuth(credentials)
	await doc.loadInfo()

	const sheet = await doc.sheetsByIndex[1]

	console.log(sheet.title)

	console.log(order)

	//const orderId = v4()
	const orderId = order.id
	const status = 'Aguardando pagamento'

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

	/*await sheet.addRows([
		{
			Pedido: orderId,
			Cliente: order.nome,
			Telefone: order.telefone,
			CPF: order.cpf,
			Produto: item.name,
			Quantidade: item.qty,
			Subtotal: item.subtotal,
			Total: 20,
			Status: status,
		},
	])*/
}

//createOrder()
module.exports = {
	saveOrder,
}
