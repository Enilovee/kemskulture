import React from 'react'
import {  Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const BlogComp = ({ blogPost }) => {
  return (
    <div className='blogScreen'>
        <Link to={`/blog-post/${blogPost._id}`} className='image-container-blog'>
            <Image src={blogPost.images && blogPost.images.length > 0 ? blogPost.images[0] :''} variant='top' className='homeImg2-blog'  />
        </Link>

        <div className='product-container-blog'>
        <h2>
             <Link to={`/blog-post/${blogPost._id}`}className=' text-decoration-none' style={{color:"#462b03",}} >
                    <strong>{blogPost.title}</strong>
               
            </Link> </h2>
            <p>
            <Link to={`/blog-post/${blogPost._id}`} className=' text-decoration-none' style={{color:"#462b03",}}>
                {blogPost.shortText}
             </Link>

            </p>
        </div>
    </div>
    
  )
}

export default BlogComp;