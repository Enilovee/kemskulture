import { Row,  Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap"
import { FaTrash,  } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import Meassage from "../components/Meassage"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, removeFromCart } from "../slices/cartSlice"
import currency from "currency.js"


const CartScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const cart = useSelector((state) => state.cart);
    const {  cartItems } = cart;


    const addToCartHandler = async (product, qty, sizes, shipppingAmount, images) => {
        dispatch(addToCart({...product, qty, sizes, shipppingAmount, images}))
    }
    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id))
    }
    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping')
    }

  return (
    <Row>
        <Col xs={12} md={8} className='mb-4'>
            <h1 style={{marginBottom:"20px"}}>Shopping Basket</h1>
            { cartItems.length === 0 ?(
                <Meassage> Your Basket Is Empty <Link to='/products'>Go Back</Link></Meassage>
            ) : (
                <section variant="black">
                    { cartItems.map((item) =>(
                        <container key={ item._id} className='cart-design'>
                            <Col >
                                <div className='cart-img'>
                                    <Image src={item.images && item.images.length > 0 ? item.images[0] :''} alt ={item.name} fluid rounded />
                                </div>
                                </Col>
                                <Col>
                                <div className="lato-boldee" > 
                                    <Link to={`/product/${item._id}`} className="text-decoration-none link-primary">                  Name: { item.name} </Link>
                                </div> 
                                <div className=" lato-boldee">
                                    Size: <span></span>
                                <span> 
                                    {item.sizes}</span>
                                </div>
                                <div className="lato-boldee"> 
                                   Price: <span></span> {currency(item.price, { symbol: '₦', formatWithSymbol: true }).format()}
                                </div>
                                <div className="lato-boldee">
                                     Quantity : <span></span>
                                <Form.Control
                                        as = 'select'
                                        className="w-25"
                                        value ={item.qty}
                                        onChange={(e) => {
                                            const newQty = Number(e.target.value);
                                            addToCartHandler(item, newQty, item.sizes, item.shippingAmount, item.images);
                                        }}>
                                            {[...Array(item.countInStock).keys()].map((x) =>(
                                              <option key={ x + 1} value={ x + 1}>
                                                { x + 1}
                                              </option>  
                                            )) }
                                        </Form.Control>
                                </div>
                                <div className='mb-4' >
                                    <Button type="button" variant="light" onClick={() => removeFromCartHandler(item._id)}>
                                        <FaTrash />
                                    </Button>
                                </div>
                               
                            </Col>
                        </container>
                    ))}
                </section>
            ) }
        </Col>
        <Col xs={12} md={4}> 
          <Card>
             <ListGroup variant= 'black'>
                <ListGroup.Item >
                    <h2 >
                        SubTotal ({ cartItems.reduce((acc, item)=> acc + item.qty, 0)}) items
                    </h2>
                    <strong className='text-decoration-line-through'>N</strong>
                    { cartItems.reduce((acc, item)=> acc +item.qty * item.price, 0).toFixed(2)}

                </ListGroup.Item>
                <ListGroup.Item>
                    <Button type="buttton" className="btn-block" disabled={ cartItems.length === 0 } 
                    onClick={checkoutHandler} >
                        Proceed To Checkout
                    </Button>
                </ListGroup.Item>
             </ListGroup>
          </Card>
        </Col>
    </Row>
  )
}

export default CartScreen