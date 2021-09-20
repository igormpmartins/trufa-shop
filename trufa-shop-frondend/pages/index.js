import Prismic from 'prismic-javascript'

const Index = (props) => {
	const { products } = props

	return (
		<div className='container mx-auto h-screen bg-gray-100'>
			<h2>Teste Trufa-Shop</h2>
			<main className='flex flex-row flex-wrap space-y-2 space-x-2'>
				{products.map((product) => {
					return (
						<section className='flex flex-col md:flex-row py-10 px-5 bg-white rounded-md shadow-lg w-1/3'>
							<div className='text-indigo-500 flex flex-col justify-between'>
								<img src={product.data.image.url} alt='' />
							</div>
							<div className='text-indigo-500'>
								<small className='uppercase'>Trufados</small>
								<h3 className='uppercase text-black text-2xl font-medium'>
									{product.data.name}
								</h3>
								<h3 className='text-2xl font-semibold mb-7'>
									R$ {product.data.price}
								</h3>
								<div className='flex gap-0.5 mt-4'>
									<button
										id='addToCartButton'
										className='bg-indigo-600 hover:bg-indigo-500 focus:outline-none transition text-white uppercase px-8 py-3'
									>
										Adicionar no carrinho
									</button>
								</div>
							</div>
						</section>
					)
				})}
			</main>
		</div>
	)
}

export async function getServerSideProps({ res }) {
	const client = Prismic.client('https://trufashop-impm.prismic.io/api/v2')
	const products = await client.query(
		Prismic.Predicates.at('document.type', 'product')
	)

	return {
		props: {
			products: products.results,
		},
	}
}

export default Index
