import React from 'react'
import { Button, Table, Row, Col } from 'react-bootstrap'
import {  FaEdit, FaTrash } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import Meassage from '../../components/Meassage'
import Loader from '../../components/Loader'
import { useGetPostsQuery, useCreatePostMutation, useDeletePostMutation } from '../../slices/blogPostApiSlice'
import { toast } from 'react-toastify'
import Paginate from '../../components/Paginate'
import { useParams } from 'react-router-dom'

const BlogPostListScreen = () => {
   const { pageNumber } = useParams()
    const {data: blogPost, isLoading, error, refetch} = useGetPostsQuery({pageNumber});

    const [createPost, {isLoading: loadingCreatePost }] = useCreatePostMutation();
    const [deletePost, {isLoading: loadingDeletePost }] = useDeletePostMutation();

    const deleteHandler = async (id) => {
      if(window.confirm('Are you sure you want to delete this item ?')) {
        try {
          await deletePost(id)
          refetch()
        } catch (err) {
          toast.error(err?.data?.messae || err.error)
        }
      }
    }

    const createPostHandler = async () => {
        if (window.confirm('Are you sure you want t create a product')) {
            try {
                await createPost()
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }


  return (
    <>
    <Row className='align-items-center'>
      <Col>
       <h1>Products</h1>
      </Col>
      <Col className='text-end'>
      <Button className='btn-sm m-3' onClick={createPostHandler} >
        <FaEdit /> Create Product
      </Button>
      </Col>
    </Row>
       {loadingCreatePost && <Loader />}
       {loadingDeletePost && <Loader />}
       { isLoading?(<Loader />): error?(<Meassage variant='danger'>{error}</Meassage>):(
        <>
        <Table  hover responsive className='table-sm'>
            <thead>
            <tr>
            <th>Topic</th>
            <th>Content</th>
            <th>Created At</th>
            <th></th>
          </tr>
            </thead>
            <tbody>
                {blogPost.map((post) =>(
                    <tr key={post._id}>
                        <td>{post.title}</td>
                        <td style={{
                        width: '40%',  // Set the width
                        padding: '10px', // Optional: Add padding
                        
                        }}>{post.content}</td>
                        <td>{post.createdAt}</td>
                        <td>
                          <LinkContainer to={`/admin/blog-post/${post._id}/edit`}  >
                            <Button variant='light' className='btn-sm mx-2'>
                                <FaEdit />
                            </Button>
                          </LinkContainer>
                          <Button variant='danger' className='btn-sm'onClick={()=> deleteHandler(post._id)}>
                            <FaTrash style={{color:'white'}} />
                          </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        <Paginate pages={blogPost.pages} page={blogPost.page} isAdmin={true} />
        </>
       ) }

    </>
  )
}

export default BlogPostListScreen