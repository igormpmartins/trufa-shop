require('dotenv').config({ path: '../.env.homologacao' })

const https = require('https')
const axios = require('axios')
const fs = require('fs')

const apiProduction = 'https://api-pix.gerencianet.com.br'
const apiStaging = 'https://api-pix-h.gerencianet.com.br'

const baseUrl = process.env.GN_ENV === 'producao' ? apiProduction : apiStaging

const getToken = async () => {
	const certif = fs.readFileSync('../' + process.env.GN_CERTIFICADO)

	const credentials = {
		client_id: process.env.GN_CLIENT_ID,
		client_secret: process.env.GN_CLIENT_SECRET,
	}

	const data = JSON.stringify({ grant_type: 'client_credentials' })
	const dataCredentials =
		credentials.client_id + ':' + credentials.client_secret
	const auth = Buffer.from(dataCredentials).toString('base64')

	const agent = new https.Agent({
		pfx: certif,
		passphrase: '',
	})

	const config = {
		method: 'POST',
		url: baseUrl + '/oauth/token',
		headers: {
			Authorization: 'Basic ' + auth,
			'Content-type': 'application/json',
		},
		httpsAgent: agent,
		data: data,
	}

	const result = await axios(config)
	return result.data
}

const createCharge = async (accessToken, chargeData) => {
	const certif = fs.readFileSync('../' + process.env.GN_CERTIFICADO)

	const agent = new https.Agent({
		pfx: certif,
		passphrase: '',
	})

	const data = JSON.stringify(chargeData)

	const config = {
		method: 'POST',
		url: baseUrl + '/v2/cob',
		headers: {
			Authorization: 'Bearer ' + accessToken,
			'Content-type': 'application/json',
		},
		httpsAgent: agent,
		data,
	}

	const result = await axios(config)
	return result.data
}

const run = async () => {
	const token = await getToken()
	const accessToken = token.access_token

	const chargeData = {
		calendario: {
			expiracao: 3600,
		},
		devedor: {
			cpf: '12345678909',
			nome: 'Igor Martins',
		},
		valor: {
			original: '1.50',
		},
		chave: 'aaa', //chave do app gerencianet
		solicitacaoPagador: 'cobrança teste TrufaShop',
	}

	const charge = await createCharge(accessToken, chargeData)
	console.log(charge)
}

run()
