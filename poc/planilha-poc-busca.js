require('dotenv').config({ path: '../.env.homologacao' })
const { GoogleSpreadsheet } = require('google-spreadsheet')
const credentials = require('../credentials.json')

const doc = new GoogleSpreadsheet(process.env.SHEET_ID)

const run = async () => {
	await doc.useServiceAccountAuth(credentials)
	await doc.loadInfo()

	const sheet = await doc.sheetsByIndex[1]

	//console.log(sheet.title)
	const rows = await sheet.getRows()
	const orderId = 123
	const status = 'Pago por Pix'

	for await (const row of rows) {
		if (!row.Pedido) {
			break
		}

		if (row.Pedido === orderId.toString()) {
			row.Status = status
			await row.save()
		}
	}

	/*
    Solução do prof:
    const sheet = await doc.sheetsByIndex[1]
    const maxRows = sheet.rowCount
    await sheet.loadCells('A1:A' + maxRows)
    await sheet.loadCells('H1:H' + maxRows)
    const validIndex = [...Array(maxRows -1).keys()]

    const orderId = 123
	const status = 'Pago por Pix'

    for await (const i of validIndex) {
        const cell = await sheet.getCell(1 + i, 0)
        if (cell.value) {
            if (cell.value === orderBy) {
                const statusCell = await sheet.getCell(1+i, 7)
                statusCell.value = status
            }
        } else {
            break
        }
    }
    
    await sheet.saveUpdatedCells()

    */
}

run()
