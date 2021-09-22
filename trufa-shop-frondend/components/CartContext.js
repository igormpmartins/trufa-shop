import { createContext, useContext, useEffect, useState } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState({})

	useEffect(() => {
		const prevCart = window.localStorage.getItem('cart')

		if (prevCart) {
			setCart(JSON.parse(prevCart))
		}
	}, [])

	const addCart = (product) => {
		setCart((old) => {
			let qty = 0

			if (old[product.id]) {
				qty = old[product.id].qty
			}

			const newCart = {
				...old,
				[product.id]: {
					product,
					qty: qty + 1,
				},
			}

			window.localStorage.setItem('cart', JSON.stringify(newCart))

			return newCart
		})
	}

	return (
		<CartContext.Provider value={{ cart, addCart }}>
			{children}
		</CartContext.Provider>
	)
}

export const useCart = () => {
	const cart = useContext(CartContext)
	return cart
}
