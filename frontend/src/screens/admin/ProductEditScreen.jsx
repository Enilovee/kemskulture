import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Meassage from '../../components/Meassage'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import { useGetProductdetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/prodApiSlice'

const ProductEditScreen = () => {
  const { id: productId} = useParams()
  const [imagePreviews, setImagePreviews] = useState([]);
  const [ name, setName] =  useState('')
  const [ price, setPrice] =  useState(0)
  const [ images, setImages] =  useState([])
  const [ brand, setBrand] =  useState('')
  const [ productType, setProductType] =  useState('')
  const [ category, setCategory] =  useState('')
  const [ countInStock, setCountInStock] =  useState('')
  const [ description, setDescription] =  useState('')

     const { data: product, isLoading, refetch, error} = useGetProductdetailsQuery(productId)
      const [updateProduct, {isLoading: loadingUpdate}]= useUpdateProductMutation()
      const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation()
      
      const navigate = useNavigate()

     const submitHandler = async(e) => {
        e.preventDefault();

        try {
      await updateProduct({
        productId,
        name,
        price,
        images,
        brand,
        productType,
        category,
        description,
        countInStock,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const [availableBrands, setAvailableBrands] = useState([]);

  // Update available brands when category changes
  useEffect(() => {
    const categoryBrandMap = {
        ladies: [
            "ladies dresses",
            "ladies tops",
            "ladies set",
            "ladies accessories",
            "ladies shorts",
            "ladies pants skirts",

        ],
        men: [
            "men pants",
            "men tops",
            "men set",
            "men accessories",
            "men shorts",
            "men jackets",
        ],
        kemBag: [
            "leather bag",
        ],
  };
  
      if (category) {
          setAvailableBrands(categoryBrandMap[category] || []);
      } else {
          setAvailableBrands([]);
      }
  }, [category]);
  
     
     useEffect(() => { 
        if(product){
            setName(product.name);
            setPrice(product.price)
            setImages(product.images)
            setBrand(product.brand)
            setProductType(product.productType)
            setCategory(product.category)
            setCountInStock(product.countInStock)
            setDescription(product.description)
        }
     }, [product])

     const submitImagehandler = async () => {
        try {
            const formData =  new FormData()
       images.forEach((image) => {
       formData.append('images', image);
        });
        const res = await uploadProductImage(formData).unwrap();
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
    <Link to="/admin/productlist" className='btn btn-light my-3' >
        Go Back
    </Link>
    <FormContainer>
        <h1>Edit Products</h1>
        { loadingUpdate && <Loader />}

        { isLoading ? (<Loader />): error ? (<Meassage variant='danger'>{error}</Meassage>):(
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2' >
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='price' className='my-2'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type='number'
                        min={0}
                        placeholder='Enter price'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='productType' className='my-2'>
                    <Form.Label>Product Type</Form.Label>
                    <Form.Control
                        as = 'select'
                        placeholder='Enter Product Type'
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value='clothes'> Clothes</option>
                        <option value='shoes'> Shoes</option>
                    </Form.Control>
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

                <Form.Group controlId='category' className='my-2'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        as='select'
                        placeholder='Enter category'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    > 
                        <option value="">All</option>
                        <option value="ladies">Women</option>
                        <option value="men">Men</option>
                        <option value="kemBag">Kem Bag</option>
                        
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='brand' className='my-2'>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                        as ='select'
                        placeholder='Enter brand'
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                         disabled = {!category}
                    >
                        <option value="">All</option>
                        {availableBrands.map((b, index) => (
                            <option key={index} value={b}>{b}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='countInStock' className='my-2'>
                    <Form.Label>Count In Stock</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder='Enter countInStock'
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='description' className='my-2'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        className='w-100'
                       style={{ height:"200px"}}
                        as='textarea'
                        type='text'
                        row = '3'
                        placeholder='Enter description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='success'className='my-2' >
                    Update
                </Button>
            </Form>
        )}

    </FormContainer>
    </>
  )
}

export default ProductEditScreen