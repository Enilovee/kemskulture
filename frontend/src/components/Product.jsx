import currency from 'currency.js'
import React from 'react'
import {  Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Product = ({ product }) => {
  return (
    <div className='homeScreen'>
        <Link to={`/product/${product._id}`} className='image-container'>
            <Image src={product.images[0]} variant='top' className='homeImg2'  />
        </Link>

        <div className='product-container'>
            <Link to={`/product/${product._id}`} style={{textDecoration:"none", }}>
                <h4  className='product-title'>
                    <strong>{product.name}</strong>
                </h4>
            </Link>
            <h5>
                <strong>
                    {currency(product.price, { symbol: '₦', formatWithSymbol: true }).format()}
                </strong>
            </h5>
        </div>
    </div>
    
  )
}

export default Product