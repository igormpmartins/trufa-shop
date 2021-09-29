//require('dotenv').config({ path: '../.env.homologacao' })
console.log('ambiente da api (lib)', process.env.GN_ENV)

const https = require('https')
const axios = require('axios')
const fs = require('fs')

const apiProduction = 'https://api-pix.gerencianet.com.br'
const apiStaging = 'https://api-pix-h.gerencianet.com.br'

const baseUrl = process.env.GN_ENV === 'producao' ? apiProduction : apiStaging

console.log(baseUrl)

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

const getLoc = async (accessToken, locId) => {
	const certif = fs.readFileSync('../' + process.env.GN_CERTIFICADO)

	const agent = new https.Agent({
		pfx: certif,
		passphrase: '',
	})

	const config = {
		method: 'GET',
		url: baseUrl + '/v2/loc/' + locId + '/qrcode',
		headers: {
			Authorization: 'Bearer ' + accessToken,
			'Content-type': 'application/json',
		},
		httpsAgent: agent,
	}

	const result = await axios(config)
	return result.data
}

const createPixCharge = async () => {
	const token = await getToken()
	const accessToken = token.access_token
	const chave = process.env.CHAVE_PIX

	const chargeData = {
		calendario: {
			expiracao: 3600,
		},
		devedor: {
			cpf: '12345678909',
			nome: 'Igor Martins',
		},
		valor: {
			original: '0.08',
		},
		chave, //chave do app gerencianet
		solicitacaoPagador: 'Pagamento - TrufaShop',
	}

	const charge = await createCharge(accessToken, chargeData)
	const qrcode = await getLoc(accessToken, charge.loc.id)
	return { qrcode, cobranca: charge }
}

const createWebHook = async () => {
	const token = await getToken()
	const accessToken = token.access_token
	const chave = process.env.CHAVE_PIX

	const certif = fs.readFileSync('../' + process.env.GN_CERTIFICADO)

	const agent = new https.Agent({
		pfx: certif,
		passphrase: '',
	})

	const data = JSON.stringify({
		webhookUrl: 'https://api-trufashop.igormpmartins.com/webhook/pix',
	})

	const config = {
		method: 'PUT',
		url: baseUrl + '/v2/webhook/' + chave,
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

module.exports = {
	createPixCharge,
	createWebHook,
}
