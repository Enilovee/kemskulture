import React from 'react'
import Loader from '../components/Loader'
import Message from '../components/Meassage'
import { useGetPostDetailsQuery  } from '../slices/blogPostApiSlice'
import { Link, useParams } from 'react-router-dom'
import { Carousel, Col, Image, Row } from 'react-bootstrap'


const BlogDetailScreen = () => {
    const { id: blogPostId } = useParams()

    const {data: post, isLoading, error } = useGetPostDetailsQuery(blogPostId);


  return (
    <>
    {isLoading ? (<Loader />) : error ? (<Message variant = 'danger'>{error?.data?.message || error?.error}</Message>):
         (<>
         <Link className='btn btn-light my-3' to="/blog-posts">
        Go back     
        </Link> 
         <Row>
    <Col xs={12} s={5} md={9} className="img-display">
                
            <Carousel pause='hover' className=' prodCar1' >
            {post.images.map((image,index)=>(
                 <Carousel.Item key={index} className='prodImgCont-blogDetails'>
                <Image key={index}  src={image} alt ={`product${index}`}  className='homeImg2-blogDetails'/>
            </Carousel.Item>
            ))}
            </Carousel>
           
            </Col> 
            <Col md={9} xs={12} className='product-container-blogDetails'>
                <h4  className='product-title'>
                    <strong>{post.title}</strong>
                </h4>
            <p>
                {post.content}
                
            </p>
        </Col>
            </Row>
            </>
  )
  }
  </>
  )
}
export default BlogDetailScreen;