import { useParams, Link, useNavigate } from 'react-router-dom'
import { Form, Row, Col, Image, Button, Carousel,} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useGetProductdetailsQuery, useCreateReviewMutation, useDeleteReviewMutation,  } from '../slices/prodApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Meassage'
import {  useState, useEffect } from 'react'
import { addToCart } from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Meassage from '../components/Meassage'
import Meta from '../components/Meta'
import currency from 'currency.js'
import RandomProd from '../components/RandomProd'
import { FaTrash } from 'react-icons/fa'




const ProductScreen = () => {

    const  dispatch = useDispatch()
    const navigate = useNavigate()

    const { id: productId } = useParams()

    const [qty, setQty] = useState(1)
    const [sizes, setSizes] = useState('')
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [selectedCity, setSelectedCity] = useState('')
    const [shippingAmount, setShippingAmount] = useState(0)

    
    
    const {data: product, isLoading, refetch, error } = useGetProductdetailsQuery(productId);
    const [createReview, {isLoading: loadingProductReview}] = useCreateReviewMutation()
    const [deleteReview, {isLoading: loadingReviewDelete }] = useDeleteReviewMutation();


    const { userInfo } = useSelector((state) => state.auth)

    

    useEffect(() => {
        const shipping = {
            iwo_road_ibadan: 5000,
            campus_gate_ife: 3000,
            oshodi_park: 6000,
            ajah_park: 8000,
            bega_park: 6000,
            lekki: 9000
        };
          if (selectedCity) {
            setShippingAmount(shipping[selectedCity] || null);
          } else {
            setShippingAmount( null );
          }
      }, [selectedCity]);



    const addToCartHandler = async (e) => {
        e.preventDefault()
             dispatch(addToCart({ ...product, qty, sizes, shippingAmount}))
             navigate('/cart')
        
       
     }
    
        const submitHandler = async (e) => {
            e.preventDefault() 
            try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap()
            refetch()
            toast.success('review submitted')
         
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
         const removeReview = async(reviewId) => {
            try {
                await deleteReview({ productId, reviewId }).unwrap();
                refetch();
                toast.success('Review deleted');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
         }
         const handleSizeClick = (e) => {
            const selectedSize = e.target.value;
            setSizes(selectedSize);
        
           
          };

  return (
    <>
        <Link className='btn btn-light my-3' to="/products">
        Go back     
        </Link>    
         {isLoading ? (<Loader />) : error ? (<Message variant = 'danger'>{error?.data?.message || error?.error}</Message>):
         (<>
         <Meta title={product.name} />
        <Row>
            <Col xs={12} s={5} md={5} className="img-display">
                
            <Carousel pause='hover' className=' prodCar1' >
            {product.images.map((image,index)=>(
                 <Carousel.Item key={index} className='prodImgCont'>
                <Image key={index}  src={image} alt ={`product${index}`}  className='productImg'/>
            </Carousel.Item>
            ))}
            </Carousel>
           
            </Col>
            <Col xs={12} s={7} md={5} className='detail'>
                 <section >
                    <div className='mb-2'>
                        <h3>{product.name}</h3>
                    </div>
                    <div className='mb-2'>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    </div>
                    
                    <div>
                        Description: {product.description}
                    </div>
                    
                 </section>
                 <div className='my-3'>
                                <h5>Select Size:</h5>
                                {product && product.productType ==='clothes' ? (
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignContent: "space-around" }}>
                                        <Button value='XS' className='productButton' onClick={handleSizeClick}>XS</Button>
                                        <Button value='S' className='productButton' onClick={handleSizeClick}>S</Button>
                                        <Button value='M' className='productButton' onClick={handleSizeClick}>M</Button>
                                        <Button value='L' className='productButton' onClick={handleSizeClick}>L</Button>
                                        <Button value='XL' className='productButton' onClick={handleSizeClick}>XL</Button>
                                        <Button value='2XL' className='productButton' onClick={handleSizeClick}>2XL</Button>
                                        <Button value='3XL' className='productButton' onClick={handleSizeClick}>3XL</Button>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignContent: "space-around" }}>
                                        <Button value='36' className='productButton' onClick={handleSizeClick}>36</Button>
                                        <Button value='37' className='productButton' onClick={handleSizeClick}>37</Button>
                                        <Button value='38' className='productButton' onClick={handleSizeClick}>38</Button>
                                        <Button value='39' className='productButton' onClick={handleSizeClick}>39</Button>
                                        <Button value='40' className='productButton' onClick={handleSizeClick}>40</Button>
                                        <Button value='41' className='productButton' onClick={handleSizeClick}>41</Button>
                                        <Button value='42' className='productButton' onClick={handleSizeClick}>42</Button>
                                        <Button value='43' className='productButton' onClick={handleSizeClick}>43</Button>
                                        <Button value='44' className='productButton' onClick={handleSizeClick}>44</Button>
                                        <Button value='45' className='productButton' onClick={handleSizeClick}>45</Button>
                                        <Button value='46' className='productButton' onClick={handleSizeClick}>46</Button>
                                        <Button value='47' className='productButton' onClick={handleSizeClick}>47</Button>
                                        <Button value='48' className='productButton' onClick={handleSizeClick}>48</Button>
                                    </div>
                                )}
                            </div>
             <Link to='/sizeDesc' className='my-3 text-decoration-none'> Size Description </Link>   

               
                    <section className='mt-4 ' >
                        <div>
                            <Row>
                                <Col> Price:</Col>
                                <Col className='centerProd'>
                                        <p>
                                    <strong>            
                                        {currency(product.price, { symbol: '₦', formatWithSymbol: true }).format()}
                                    </strong>
                                </p>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <Row>
                                <Col > Status:</Col>
                                <Col className='centerProd'>
                                  <strong>{product.countInStock > 0 ? 'In stock' :'Out of Stock'}</strong>
                                </Col>
                            </Row>
                        </div>

                            {product.countInStock > 0 && (
                                <div>
                                    <Row>
                                        <Col>Qty</Col>
                                        <Col className='centerProd'>
                                        <Form.Control
                                        as = 'select'
                                        value ={qty}
                                        onChange = {(e) => setQty(Number(e.target.value))}>
                                            {[...Array(product.countInStock).keys()].map((x) =>(
                                              <option key={ x + 1} value={ x + 1}>
                                                { x + 1}
                                              </option>  
                                            )) }
                                        </Form.Control>
                                        </Col>
                                    </Row>
                                </div> 
                                )}
                               <div>
                               <Row>
                               <Form.Group controlId="selectedCity">
                                    <Form.Label>Nearest Bustop</Form.Label>
                                    <Form.Control as="select" value={selectedCity}
                                     onChange={(e) => setSelectedCity(e.target.value)} required>
                                        <option value="">All</option>
                                         <option value="iwo_road_ibadan">Iwo Road Ibadan</option>
                                        <option value="campus_gate_ife"> Campus Gate Ife</option>
                                        <option value="oshodi_park">Oshodi Park</option>
                                        <option value="bega_park">Bega Park</option>
                                        <option value="ajah_park">Ajah park</option>
                                        <option value="lekki">Lekki</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="shippingAmount">
                                        <Form.Label>Shipping Amount</Form.Label>
                                        <Form.Control as="select" value={shippingAmount}
                                        onChange={(e) => setShippingAmount(e.target.value)} disabled={!selectedCity}>
                                            <option value={shippingAmount} >{shippingAmount}</option>
                                        </Form.Control>
                                 </Form.Group>
                                </Row>
                                </div>
                               
                           
                    
                               

                        <div>
                            <Button
                            className='btn-block mt-4'
                            type='submit'
                            disabled={product.countInStock===0}
                            onClick={addToCartHandler}
                            > Add To Cart </Button>
                        </div>
                    </section>
                
                
            </Col>
        </Row>
        <Row className='review'>
           <Col xs={12} md={6}>
            <h2>Reviews</h2> 
            { product.reviews.length === 0 && <Meassage>No Reviews</Meassage>}
            <section variant='flush'>
                {product.reviews.map( review => (
                    <div key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} />
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>

                    {userInfo && userInfo.isAdmin && (
                        <Button variant='danger' className='btn-sm'onClick={()=> removeReview(review._id)}>
                        <FaTrash style={{color:'white'}} />
                      </Button>
                    )} 
                     </div>
                ))}                   
                 {loadingReviewDelete && <Loader />}

                <div>
                    <h2>Write a  Review</h2>
                    {loadingProductReview && <Loader />}
                    { userInfo ? (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='rating' className='my-2'>
                                <Form.Label>Rating</Form.Label>
                                <Form.Control 
                                as ='select' 
                                required
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                >
                                    <option value=''>Select...</option>
                                    <option value='1'>1- Bad</option>
                                    <option value='2'>2- poor</option>
                                    <option value='3'>3- Fair</option>
                                    <option value='4'>4 -Good</option>
                                    <option value='5'>5- Excellent</option>
                                </Form.Control>

                            </Form.Group>
                            <Form.Group controlId='comment' className='my-2'>
                                <Form.Label>Comment</Form.Label>
                                <Form.Control 
                                as ='textarea' 
                                required
                                row='3'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Button
                             disabled={loadingProductReview}
                             type='submit'
                             variant='success'
                            > Submit </Button>
                        </Form>
                    ) : (
                        <Meassage>
                            please <Link to='/login'>sign in</Link> to write a review {' '}
                        </Meassage>
                    )}
                     
                </div>
            </section>
           </Col> 
           <section className='mt-4'>
            <h3>Recomended products</h3>
            <RandomProd />
            </section>                                    
        </Row>
          </>              
     
     )}
        
    </>
  )
}

export default ProductScreen