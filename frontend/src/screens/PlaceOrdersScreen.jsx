import React,{useEffect} from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import { toast } from 'react-toastify'
import Meassage from '../components/Meassage'
import Loader from '../components/Loader'
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice'
import currency from 'currency.js'



const PlaceOrdersScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);

    const [ createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
          navigate('/shipping');
        } else if (!cart.paymentMethod) {
          navigate('/payment');
        } 
        }, [ cart.shippingAddress.address, cart.paymentMethod, navigate]);


        const dispatch = useDispatch();
        const placeOrderHandler = async () => {
          try {
            const res = await createOrder({
              orderItems: cart.cartItems,
              shippingAddress: cart.shippingAddress,
              paymentMethod: cart.paymentMethod,
              itemsPrice: cart.itemsPrice,
              shippingPrice: cart.shippingPrice,
              taxPrice: cart.taxPrice,
              totalPrice: cart.totalPrice,
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
          } catch (err) {
            toast.error(err);
          }

        };

  return (
    <>
      <CheckoutSteps process1 process2 process3 process4 />
      <Row className='text-black' >
        <Col xs={12} md={8}> 
        <ListGroup  >
          <ListGroup.Item >
            <h2>Shipping Address</h2>
            <p >
              <strong>Address: 
              {cart.shippingAddress.address},{cart.shippingAddress.city},{cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country} </strong>
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Payment Method</h2>
            <p>
              <strong> Method: </strong>
              { cart.paymentMethod}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Order Items</h2>
            { cart.cartItems.length === 0 ? (
              <Meassage>Your Cart Is Empty</Meassage>
            ) : (
              <ListGroup > 
                { cart.cartItems.map((item, index) =>(
                  <container key={ item._id} className='cart-design'>
                            <Col >
                                <div className='cart-img'>
                                    <Image src={item.images && item.images.length > 0 ? item.images[0] :''} alt ={item.name} fluid rounded />
                                </div>
                                </Col>
                                <Col>
                                <div className="lato-boldee" > 
                                    <Link to={`/product/${item._id}`} className="text-decoration-none link-primary "> Name:  { item.name} </Link>
                                </div> 
                                <div className=" lato-boldee">
                                    Size: {item.sizes}
                                </div>
                                <div className="lato-boldee"> 
                                   Price: <span></span>  {currency(item.price, { symbol: '₦', formatWithSymbol: true }).format()}
                                </div>
                                <div className='lato-boldee'>
                                Quantity:    { item.qty } 
                                    <br />
                                    <br />  
                                    Items(s)Total : {currency(item.price*item.qty, { symbol: '₦', formatWithSymbol: true }).format()}
                                  </div>
                                  <div className='lato-boldee'>
                                  Shipping Amount =  {currency(item.shippingAmount, { symbol: '₦', formatWithSymbol: true }).format()}
                                  </div>
                                          
                                        </Col>
                        </container>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </ListGroup>
        </Col>
        <Col xs={12} md={4}>
           <Card>
            <ListGroup >
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                  <Row>
              <Col> Items</Col>
              <Col>{currency(cart.itemsPrice, { symbol: '₦', formatWithSymbol: true }).format()}</Col>
            </Row>
            <Row>
              <Col> Shipping </Col>
              <Col>{currency(cart.shippingPrice, { symbol: '₦', formatWithSymbol: true }).format()}</Col>
            </Row>
            <Row>
              <Col> VAT</Col>
              <Col>{currency(cart.taxPrice, { symbol: '₦', formatWithSymbol: true }).format()}</Col>
            </Row>
            <Row>
              <Col> Total </Col>
              <Col>{currency(cart.totalPrice, { symbol: '₦', formatWithSymbol: true }).format()}</Col>
            </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Meassage variant='danger' >{error.data.message}</Meassage>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
           </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrdersScreen