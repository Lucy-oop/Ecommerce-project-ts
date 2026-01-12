import axios from 'axios';
import { useEffect,useState } from 'react';
import { useSearchParams } from 'react-router';
import { Header } from '../../components/Header';
import { ProductsGrid } from './ProductsGrid';
import CheckmarkIcon from '../../assets/images/icons/checkmark.png';
import './HomePage.css';

export function HomePage({ cart,loadCart }) {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams(); //lets you read the query parameters from the URL.
    const search = searchParams.get('search'); //Get the value of search from the URL.

   

  useEffect(()=> {
    const getHomeData = async () => {
      const urlPath = search ? `/api/products?search=${search}`: '/api/products';
      const response = await axios.get(urlPath);
      setProducts(response.data);
    };
    getHomeData();
  },[search]);

    

    return (
        <>
            <title>Ecommerce Project</title>
            <link rel="icon" type="image/svg+xml" href="home-favicon.png" />

            <Header cart= {cart}/>

            <div className="home-page">
                <ProductsGrid products={products} loadCart={loadCart}/>
            </div>
       </>
    );
}