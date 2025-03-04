import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Meassage from '../../components/Meassage'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import { useGetPostDetailsQuery, useUpdatePostMutation, useUploadPostImageMutation } from '../../slices/blogPostApiSlice'

const BlogPostEditScreen = () => {
  const { id: blogPostId} = useParams()
  const [imagePreviews, setImagePreviews] = useState([]);
  const [ title, setTitle] =  useState('')
  const [ content, setContent] =  useState('')
  const [ shortText, setShortText] =  useState('')
  const [ images, setImages] =  useState([])
 

     const { data: blogPost, isLoading, refetch, error} = useGetPostDetailsQuery(blogPostId)
      const [updatePost, {isLoading: loadingUpdate}]= useUpdatePostMutation()
      const [uploadPostImage, {isLoading: loadingUpload}] = useUploadPostImageMutation()
      
      const navigate = useNavigate()

     const submitHandler = async(e) => {
        e.preventDefault();

        try {
      await updatePost({
        blogPostId,
        title,
        content,
        shortText,
        images,
        
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('Blog Post updated');
      refetch();
      navigate('/admin/bloglist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

     
     useEffect(() => { 
        if(blogPost){
            setTitle(blogPost.title);
            setContent(blogPost.content)
            setShortText(blogPost.shortText)
            setImages(blogPost.images)
            
        }
     }, [blogPost])

     const submitImagehandler = async () => {
        try {
            const formData =  new FormData()
       images.forEach((image) => {
       formData.append('images', image);
        });
        const res = await uploadPostImage(formData).unwrap();
       toast.success('images Uploaded')
       setImages(res.images)
 

   } catch (err) {
       toast.error(err?.data?.message || err.error)
   }
     }
     

     const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        
      const imageURLs = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(imageURLs);
    
    }  
    

       

       
  return (
    <>
    <Link to="/admin/bloglist" className='btn btn-light my-3' >
        Go Back
    </Link>
    <FormContainer>
        <h1>Edit Products</h1>
        { loadingUpdate && <Loader />}

        { isLoading ? (<Loader />): error ? (<Meassage variant='danger'>{error}</Meassage>):(
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='topic' className='my-2' >
                    <Form.Label>Topic</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter topic'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='shortText' className='my-2  '>
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                       style={{
                        width: '100%',  
                        height: '100px', 
                        padding: '10px', 
                        border: '1px solid #ccc', 
                        fontSize: '16px', 
                      }}
                        as = 'textarea'
                        type='text'
                        placeholder='Enter brief description of the post'
                        value={shortText}
                        onChange={(e) => setShortText(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='content' className='my-2  '>
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                       style={{
                        width: '100%',  
                        height: '200px', 
                        padding: '10px', 
                        border: '1px solid #ccc', 
                        fontSize: '16px', 
                      }}
                        as = 'textarea'
                        type='text'
                        placeholder='Enter Content'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                

                <Form.Group controlId='images' className='my-2'>
                    <Form.Label>Images</Form.Label>
                    
                    <Form.Control
                        type='file'
                        multiple
                        label='Choose File'              
                        onChange={handleFileChange}
                    ></Form.Control>
                    {imagePreviews.length > 0 && (
                    <div>
                        <h2>Image Previews</h2>
                        <div className="image-grid">
                        {imagePreviews.map((preview, index) => (
                            <img key={index} src={preview} alt={`Preview ${index + 1}`} />
                        ))}
                        </div>
                    </div>
                    )}
                    <Button onClick={submitImagehandler}> save images to cloud</Button>
                  
                </Form.Group>       
                 { loadingUpload && <Loader />}

                <Button type='submit' variant='success'className='my-2' >
                    Update
                </Button>
            </Form>
        )}

    </FormContainer>
    </>
  )
}

export default BlogPostEditScreen