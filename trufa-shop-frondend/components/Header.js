import { useCart } from './CartContext'

const Header = () => {
	const cart = useCart()
	const cartItems = Object.keys(cart.cart)

	const tot = cartItems.reduce((prev, curr) => {
		return prev + cart.cart[curr].qty
	}, 0)

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
								Carrinho {tot > 0 && <span>({tot}) </span>}
							</a>
						</div>
					</div>
				</div>
			</nav>
		</header>
	)
}

export default Header
