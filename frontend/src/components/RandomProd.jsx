// components/ProductList.js
import React from 'react';
import { useGetRandomProductQuery } from '../slices/prodApiSlice';
import Loader from './Loader';
import { Link } from 'react-router-dom';
import { Image} from 'react-bootstrap';
import Meassage from './Meassage';
import currency from 'currency.js';

const ProductList = () => {
  const { data: products, error, isLoading } = useGetRandomProductQuery();


  if (isLoading) return <Loader />;
  if (error) return <Meassage variant='danger'>{error?.data?.message || error.error}</Meassage>;

  return (
    <div className="product-scroll-container">
    {products.map((product) => (
      <div key={product._id} className="product-card">
        <Link to={`/product/${product._id}`} className="product-link">
        <Image src={product.images[0]} alt={product.name}className="product-image" fluid />
          <h4>{product.name}</h4>
          <h5>{currency(product.price, { symbol: '₦', formatWithSymbol: true }).format()}</h5>
        </Link>
      </div>
    ))}
  </div>
  );
};

export default ProductList;