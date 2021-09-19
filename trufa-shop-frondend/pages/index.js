import Prismic from 'prismic-javascript'

const Index = (props) => {
	return (
		<div>
			<h2>Teste Trufa-Shop</h2>
			<pre>{JSON.stringify(props, null, 2)}</pre>
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
			date: Date.now(),
			products: products.results,
		},
	}
}

export default Index
