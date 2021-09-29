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

	const clearCart = () => {
		const newCart = {}
		setCart(newCart)
		window.localStorage.setItem('cart', JSON.stringify(newCart))
	}

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

	const removeFromCart = (key) => {
		setCart((old) => {
			/*exemplo da aula:
			const newCart = {}
			Object.keys(old).forEach(id => {
				if (id !== key ) {
					newCart[id] = old[id]
				}
			})
			return newCart
			*/

			delete old[key]
			const newCart = {
				...old,
			}
			window.localStorage.setItem('cart', JSON.stringify(newCart))
			return newCart
		})
	}

	const changeItemQty = (key, newQty) => {
		setCart((old) => {
			/*exemplo da aula:
			const newCart = {}
			Object.keys(old).forEach(id => {
				const newProduct = {...old[id]}

				if (id === key ) {
					newProduct.qty = newQty
				}
				newCart[id] = newProduct
			})
			return newCart
			*/

			old[key].qty = newQty

			const newCart = {
				...old,
			}
			window.localStorage.setItem('cart', JSON.stringify(newCart))
			return newCart
		})
	}

	return (
		<CartContext.Provider
			value={{ cart, addCart, removeFromCart, changeItemQty, clearCart }}
		>
			{children}
		</CartContext.Provider>
	)
}

export const useCart = () => {
	const cart = useContext(CartContext)
	return cart
}
