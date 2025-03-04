import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/prodApiSlice';
import Loader from '../components/Loader';
import FilterSidebar from '../components/FilterSidebar';
import Message from '../components/Meassage';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import HomeImg from '../components/HomeImage';

const HomeScreen = () => {
  const [showProducts, setShowProducts] = useState(false);
  const { pageNumber, keyword, category, brand, } = useParams();

  const { data, error, isLoading } = useGetProductsQuery({
    pageNumber,
    keyword,
    category,
    brand,
    
  });

  const toggleProductsVisibility = () => {
    setShowProducts((prev) => !prev);
    ;
  };

  

  return (
    <>
    <HomeImg />

      {
        <Link to='/products' className='btn btn-light mx-4 mb-4 '>Go Back</Link>
      }
      <Button onClick={toggleProductsVisibility} className='mx-4 mb-4' variant='outline-warning'>
        {showProducts  ? 'close' : 'Filter'}
        
      </Button>
    
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error?.error}</Message>
      ) : (
        <>
        {showProducts && (
                <Col xs={12} md={6}>
               <FilterSidebar />
            </Col>
              )}
              <div className="featured"> <h1> Products</h1></div>
         
          <Row>
           
            <Col   md={12}>
              <Row > 
                {data && data.products && data.products.length > 0 ? (
                  data.products.map((product) => (
                    <Col key={product._id} xs={6} sm={6} md={6} lg={4} xl={4} className='homeFlex'>
                      <Product product={product} />
                    </Col>
                  ))
                ) : (
                  <Message variant='info'>No products found</Message>
                )}
              </Row>
              {data && (
                <Paginate
                  pages={data.pages}
                  page={data.page}
                  keyword={keyword ? keyword : " "}
                />
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;