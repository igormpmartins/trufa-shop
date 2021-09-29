//import Prismic from 'prismic-javascript'
import Header from '../components/Header'
import Head from 'next/head'
import { useCart } from '../components/CartContext'
import { useFormik } from 'formik'
import axios from 'axios'
import { useState } from 'react'

const CartList = () => {
	//pre-order, ordering, order-received
	const [orderStatus, setOrderStatus] = useState('pre-order')
	const [qrCode, setQrCode] = useState('')

	const cart = useCart()
	const cartItems = Object.keys(cart.cart)

	const totalQty = cartItems.reduce((prev, curr) => {
		return prev + cart.cart[curr].qty
	}, 0)

	const totalPrice = cartItems.reduce((prev, curr) => {
		return prev + cart.cart[curr].qty * cart.cart[curr].product.data.price
	}, 0)

	const form = useFormik({
		initialValues: {
			nome: '',
			cpf: '',
			telefone: '',
		},
		onSubmit: async (values) => {
			const order = { ...values }
			const items = cartItems.map((i) => {
				const prod = cart.cart[i].product.data
				const item = {
					name: prod.name,
					qty: cart.cart[i].qty,
					price: prod.price,
				}
				return item
			})
			order.items = items

			//const url = 'http://localhost:3001/create-order'
			//const url = 'https://api-trufashop.igormpmartins.com/create-order'
			const url = process.env.NEXT_PUBLIC_API_URL + 'create-order'

			setOrderStatus('ordering')
			const res = await axios.post(url, order)
			setOrderStatus('order-received')
			setQrCode(res.data.qrcode.imagemQrcode)

			console.log(res.data)
		},
	})

	const removeItem = (key) => () => {
		cart.removeFromCart(key)
	}

	const changeQty = (key) => (evt) => {
		const newQty = Number(evt.target.value)
		cart.changeItemQty(key, newQty)
	}

	const formatVal = (input) => {
		return Number(input).toFixed(2).replace('.', ',')
	}

	return (
		<div className='flex justify-center my-6'>
			<div className='flex flex-col w-full p-8 text-gray-800 bg-white shadow-lg pin-r pin-y md:w-4/5 lg:w-4/5'>
				<div className='flex-1'>
					<table className='w-full text-sm lg:text-base' cellSpacing='0'>
						<thead>
							<tr className='h-12 uppercase'>
								<th className='hidden md:table-cell'></th>
								<th className='text-left'>Produto</th>
								<th className='lg:text-right text-left pl-5 lg:pl-0'>
									<span className='lg:hidden' title='Quantity'>
										Qtd
									</span>
									<span className='hidden lg:inline'>Quantidade</span>
								</th>
								<th className='hidden text-right md:table-cell'>
									Preço unitário
								</th>
								<th className='text-right'>Preço Total</th>
							</tr>
						</thead>
						<tbody>
							{Object.keys(cart.cart).map((key) => {
								const { qty, product } = cart.cart[key]
								const prodData = product.data
								const totPrice = Number(qty * prodData.price)

								return (
									<tr key={key}>
										<td className='hidden pb-4 md:table-cell'>
											<img
												src={prodData.image.url}
												className='w-20 rounded'
												alt={prodData.name}
											/>
										</td>
										<td>
											<p className='mb-2 md:ml-4'>{prodData.name}</p>

											<button
												type='submit'
												className='text-gray-700 md:ml-4'
												onClick={removeItem(key)}
											>
												<small>(Remover item)</small>
											</button>
										</td>
										<td className='justify-center md:justify-end md:flex mt-6'>
											<div className='w-20 h-10'>
												<div className='relative flex flex-row w-full h-8'>
													<input
														type='number'
														defaultValue={qty}
														onBlur={changeQty(key)}
														onChange={changeQty(key)}
														min='1'
														className='w-full font-semibold text-center text-gray-700 bg-gray-200 outline-none focus:outline-none hover:text-black focus:text-black'
													/>
												</div>
											</div>
										</td>
										<td className='hidden text-right md:table-cell'>
											<span className='text-sm lg:text-base font-medium'>
												R$ {formatVal(prodData.price)}
											</span>
										</td>
										<td className='text-right'>
											<span className='text-sm lg:text-base font-medium'>
												R$ {formatVal(totPrice)}
											</span>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
					<hr className='pb-6 mt-6' />
					<div className='my-4 mt-6 -mx-2 lg:flex'>
						<div className='lg:px-2 lg:w-1/2'>
							<div className='p-4 bg-gray-100 rounded-full'>
								<h1 className='ml-2 font-bold uppercase'>Seus dados</h1>
							</div>
							<div className='p-4'>
								<div className='justify-center'>
									{orderStatus === 'pre-order' && (
										<form onSubmit={form.handleSubmit}>
											<p className='mb-4 italic'>
												Por favor, informe seus dados para concluir o pedido
											</p>
											<div className='flex items-center w-full h-13 pl-3 bg-white my-2'>
												<label className='w-1/4'>Seu nome</label>
												<input
													type='text'
													name='nome'
													id='nome'
													placeholder='Informe seu nome'
													value={form.values.nome}
													onChange={form.handleChange}
													className='w-3/4 p-4 bg-gray-100 outline-none appearance-none focus:outline-none active:outline-none border rounded-full'
												/>
											</div>
											<div className='flex items-center w-full h-13 pl-3 bg-white my-2'>
												<label className='w-1/4'>Seu CPF</label>
												<input
													type='text'
													name='cpf'
													id='cpf'
													placeholder='Informe seu cpf'
													value={form.values.cpf}
													onChange={form.handleChange}
													className='w-3/4 p-4 bg-gray-100 outline-none appearance-none focus:outline-none active:outline-none border rounded-full'
												/>
											</div>
											<div className='flex items-center w-full h-13 pl-3 bg-white my-2'>
												<label className='w-1/4'>Seu telefone</label>
												<input
													type='text'
													name='telefone'
													id='telefone'
													placeholder='Informe seu telefone'
													value={form.values.telefone}
													onChange={form.handleChange}
													className='w-3/4 p-4 bg-gray-100 outline-none appearance-none focus:outline-none active:outline-none border rounded-full'
												/>
											</div>
											<button className='flex justify-center w-full px-10 py-3 mt-6 font-medium text-white uppercase bg-gray-800 rounded-full shadow item-center hover:bg-gray-700 focus:shadow-outline focus:outline-none'>
												<svg
													aria-hidden='true'
													data-prefix='far'
													data-icon='credit-card'
													className='w-8'
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 576 512'
												>
													<path
														fill='currentColor'
														d='M527.9 32H48.1C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48.1 48h479.8c26.6 0 48.1-21.5 48.1-48V80c0-26.5-21.5-48-48.1-48zM54.1 80h467.8c3.3 0 6 2.7 6 6v42H48.1V86c0-3.3 2.7-6 6-6zm467.8 352H54.1c-3.3 0-6-2.7-6-6V256h479.8v170c0 3.3-2.7 6-6 6zM192 332v40c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12zm192 0v40c0 6.6-5.4 12-12 12H236c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12z'
													/>
												</svg>
												<span className='ml-2 mt-5px'>Concluir pedido</span>
											</button>
										</form>
									)}
									{orderStatus === 'ordering' && (
										<p>Pedido sendo efetuado, aguarde.</p>
									)}
									{orderStatus === 'order-received' && (
										<div>
											<p>
												Pedido recebido! Efetue o pagamento com o qrCode abaixo
												para concluir seu pedido.
											</p>
											<img src={qrCode}></img>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className='lg:px-2 lg:w-1/2'>
							<div className='p-4 bg-gray-100 rounded-full'>
								<h1 className='ml-2 font-bold uppercase'>Detalhes do pedido</h1>
							</div>
							<div className='p-4'>
								<div className='flex justify-between border-b'>
									<div className='lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800'>
										Quantidade
									</div>
									<div className='lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900'>
										{totalQty}
									</div>
								</div>
								<div className='flex justify-between pt-4 border-b'>
									<div className='lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800'>
										Preço Total
									</div>
									<div className='lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900'>
										R$ {formatVal(totalPrice)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const Index = (props) => {
	return (
		<div>
			<Head>
				<title>TrufaShop - Carrinho</title>
			</Head>
			<Header />
			<CartList />
		</div>
	)
}

export async function getServerSideProps({ res }) {
	/*const client = Prismic.client('https://trufashop-impm.prismic.io/api/v2')
	const products = await client.query(
		Prismic.Predicates.at('document.type', 'product')
	)*/

	return {
		props: {
			//products: products.results,
		},
	}
}

export default Index
