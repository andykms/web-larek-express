<<<<<<< HEAD
import Card from '@components/card';
import Grid from '@components/grid/grid';
import { productsSelector } from '@slices/products';
import { IProduct } from '@types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
=======
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../../components/card/card';
import Gallery from '../../components/gallery/gallery';
import { productsSelector } from '../../services/slice/products';
>>>>>>> admin

export default function MainPage() {
	const products = useSelector(productsSelector.selectProducts);
	return (
<<<<<<< HEAD
		<Grid<IProduct> data={products}>
			{({ extraClass, data }) => <Card extraClass={extraClass} key={data._id} dataCard={data} component={Link} />}
		</Grid>
	);
=======
		<Gallery>
		{products.map(product => (
			<Card key={product._id} dataCard={product} component={Link} />
		))}
	</Gallery>
	)
>>>>>>> admin
}
