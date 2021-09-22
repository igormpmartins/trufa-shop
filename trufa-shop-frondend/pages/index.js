import Prismic from 'prismic-javascript'
import Header from '../components/Header'
import Product from '../components/Product'
import Head from 'next/head'

const Index = ({ products }) => {
	return (
		<div>
			<Head>
				<title>TrufaShop - Produtos</title>
			</Head>
			<Header />
			<div className='container mx-auto h-screen mt-6'>
				<main className='grid grid-flow-col grid-cols-2 gap-2 mt-4'>
					{products.map((product) => {
						return <Product key={product.id} product={product} />
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
