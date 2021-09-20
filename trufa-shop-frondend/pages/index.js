import Prismic from 'prismic-javascript'

const CartIcon = () => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='h-6 w-6'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			className='w-6'
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
			/>
		</svg>
	)
}

const Menu = () => {
	return (
		<header className='bg-white shadow'>
			<nav className='container mx-auto px-6 py-3'>
				<div className='flex flex-col md:flex-row md:justify-between md:items-center'>
					<div className='flex justify-between items-center'>
						<div className='flex items-center'>
							<a
								className='text-gray-800 text-xl font-bold md:text-2xl hover:text-gray-700'
								href='#'
							>
								<img src='/logo.png' alt='TrufaShop' />
							</a>
						</div>
					</div>

					<div className='md:flex items-center'>
						<div className='flex flex-col mt-2 md:flex-row md:mt-0 md:mx-1'>
							<a
								className='my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 hover:underline md:mx-4 md:my-0'
								href='#'
							>
								Home
							</a>
							<a
								className='my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 hover:underline md:mx-4 md:my-0'
								href='#'
							>
								Contato
							</a>
						</div>

						<div className='flex items-center py-2 -mx-1 md:mx-0'>
							<a
								className='block w-1/2 px-3 py-2 mx-1 rounded text-center text-sm bg-blue-500 font-medium text-white leading-5 hover:bg-blue-600 md:mx-0 md:w-auto'
								href='#'
							>
								Carrinho (0)
							</a>
						</div>
					</div>
				</div>
			</nav>
		</header>
	)
}

const Index = (props) => {
	const { products } = props

	return (
		<div>
			<Menu />
			<div className='container mx-auto h-screen mt-6'>
				<main className='grid grid-flow-col grid-cols-2 gap-2 mt-4'>
					{products.map((product) => {
						return (
							<section className='flex flex-col md:flex-row py-10 px-5 bg-white rounded-md shadow-lg gap-4'>
								<div className='text-indigo-500 flex flex-col justify-between'>
									<img src={product.data.image.url} alt='' />
								</div>
								<div className='text-indigo-500'>
									<small className='uppercase'>Trufados</small>
									<h3 className='uppercase text-black text-2xl font-medium'>
										{product.data.name}
									</h3>
									<h3 className='text-2xl font-semibold mb-7'>
										R$ {parseFloat(product.data.price).toFixed(2)}
									</h3>
									<div className='flex gap-0.5 mt-0 xl:mt-24'>
										<button
											id='addToCartButton'
											className='bg-indigo-600 hover:bg-indigo-500 focus:outline-none transition text-white uppercase px-8 py-3'
										>
											<CartIcon />
										</button>
									</div>
								</div>
							</section>
						)
					})}
				</main>
			</div>
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
