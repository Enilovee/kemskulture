import React from 'react'
import { Carousel, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useGetTopProductQuery } from '../slices/prodApiSlice'
import Loader from './Loader'
import Meassage from './Meassage'
import currency from 'currency.js'

const ProductCarousel = () => {
    const {data: products, isLoading, error} = useGetTopProductQuery()

  return  isLoading ?( <Loader /> ): error ? (
  <Meassage variant='danger'>{error?.data?.message || error.error}</Meassage>):( 
        <Carousel pause='hover' className='carouselDesign' variant='dark' >
            {products.map( (product) => (
                <Carousel.Item key={product._id} className='carousel-size2'> 
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.images[0]} alt={product.name} fluid className='carousel-size' />
                        <Carousel.Caption className='carousel-caption'>
                            <h2 className='text-white text-right'>
                                {product.name} (<strong>
                    {currency(product.price, { symbol: '₦', formatWithSymbol: true }).format()}
                </strong>)
                                </h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
  
}

export default ProductCarousel