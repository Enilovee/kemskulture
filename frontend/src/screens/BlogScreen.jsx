import React from 'react';
import {  Col, Row } from 'react-bootstrap';
import Post from '../components/BlogComp';
import { useGetPostsQuery } from '../slices/blogPostApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Meassage';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';

const BlogScreen = () => {
  const { pageNumber, } = useParams();

  const { data: posts, error, isLoading } = useGetPostsQuery({pageNumber });

  

  

  return (
    <>

      
        <Link to='/' className='btn btn-light mx-4 mb-4  '>Go Back</Link>
    
    
    
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error?.error}</Message>
      ) : (
        <>
        
          <h1>Blog Posts</h1>
          <Row>
           
            <Col md={12}>
              <Row > 
                {posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <Col key={post._id} xs={12} sm={12} md={12} lg={12} xl={12} className='homeFlex'>
                      <Post blogPost={post} />
                    </Col>
                  ))
                ) : (
                  <Message variant='info'>No products found</Message>
                )}
              </Row>
              {posts && (
                <Paginate
                  pages={posts.pages}
                  page={posts.page}
                />
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default BlogScreen;