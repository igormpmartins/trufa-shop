require('dotenv').config({ path: '../.env.homologacao' })
const { GoogleSpreadsheet } = require('google-spreadsheet')
const credentials = require('../credentials.json')

const doc = new GoogleSpreadsheet(process.env.SHEET_ID)

const run = async () => {
	await doc.useServiceAccountAuth(credentials)
	await doc.loadInfo()

	const sheet = await doc.sheetsByIndex[1]

	console.log(sheet.title)

	await sheet.addRows([
		{
			Pedido: 123,
			Cliente: 'Igoru',
			Telefone: '123',
			Produto: 'Truremote',
			Quantidade: 10,
			Subtotal: 20,
			Total: 20,
			Status: 'Aguardando pagamento',
		},
	])
}

run()
