import React,{useEffect} from 'react'

import {Link, useParams} from 'react-router-dom'
import {Row, Col, ListGroup, Image,  Button, Card } from 'react-bootstrap'
import {  usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Meassage from '../components/Meassage'
import Loader from '../components/Loader'
import {toast} from 'react-toastify';

import { useGetOrderDetailsQuery,
   usePayOrderMutation, 
   useGetPayStackClientIdQuery,
    useDeliverOrderMutation,  
    useShippingOrderMutation,
    useConfirmPaymentOrderMutation
  } from '../slices/ordersApiSlice'
import { useSelector } from 'react-redux'
import currency from 'currency.js'

const OrderScreen = () => {
  const {id :orderId} = useParams()

   const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId)

   const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation()

   const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();
   const [confirmPaymentOrder, {isLoading: loadingAwaitingPayment}] = useConfirmPaymentOrderMutation();
   const [shippingOrder, {isLoading: loadingShipping}] = useShippingOrderMutation();

     const {userInfo} = useSelector ((state) =>state.auth)

  
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  
    const {data: paypal, isLoading : loadingPayPal, error: errorPayPal } = useGetPayStackClientIdQuery();


    useEffect(() => {
      if(!errorPayPal && !loadingPayPal && paypal.clientId){
        const loadPayPalScript  = async () => {
          paypalDispatch({
            type:"resetOptions",
            value:{
              'client-id': paypal.clientId,
              currency :"USD",
            },
          })
          paypalDispatch({ type: 'setLoadingStatus', value: 'pending'})
        }
        if(order && !order.isPaid) {
          if(!window.paypal){
            loadPayPalScript()
          }
        }
      }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal ])

    // function onApprove (data, actions){
    //   return actions.order.capture().then( async function(details){
    //     try {
    //       await payOrder ({orderId, details});
    //       refetch();
    //       toast.success("Payment Successful")
    //     } catch (err) {
    //       toast.error(err?.data?.message || err.message)
    //     }
    //    }) 
    // }
    async function onApproveTest (){
      await payOrder ({orderId, details:{ payer:{} } });
      refetch();
      toast.success("Payment Is successful")
    
    }
    // function onError (err){
    //   toast.error(err.message)
    // }
    // function createOrder (data, actions) {
    //   return actions.order
    //     .create({
    //       purchase_units:[
    //         {
    //           amount: {
    //             value: order.totalPrice,
    //           },
    //         },
    //       ],
    //     }).then((orderId) =>{
    //       return orderId;
    //     })
    // }
     
     const deliverOrderHandler = async () => {
       try {
        await deliverOrder(orderId)
        refetch()
        toast.success('Order delivered')
       } catch (err) {
        toast.error(err?.data?.message || err.message)
       }
     }
     const ConfirmPaymentHandler = async () => {
       try {
        await confirmPaymentOrder (orderId)
        refetch()
        toast.success('Your payment was successful')
       } catch (err) {
        toast.error(err?.data?.message || err.message)
       }
     }
     const ShippingItems = async () => {
       try {
        await shippingOrder (orderId)
        refetch()
        toast.success('Your item is in transit')
       } catch (err) {
        toast.error(err?.data?.message || err.message)
       }
     }
   
  return isLoading ? (<Loader />): error? ( <Meassage variant='danger'>
                {error.data.message}
  </Meassage> ) : (

    <>
    <Link to='/products' className='btn btn-light mx-4 mb-4 '>Go Back</Link>

     <h1>ORDER {order._id}</h1>
     <Row>
      <Col xs={12} md={8}>
        <ListGroup >
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              <strong>Name :</strong> {order.user.name}
            </p>
            <p>
              <strong>Email :</strong> {order.user.email}
            </p>
            <p>
              <strong>Phone :</strong> {order.user.phone}
            </p>
            <p>
              <strong>Address :</strong> {order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.postalCode},{''}
              {order.shippingAddress.country}
              </p>
              {order.isDelivered ?(
                <Meassage variant='success'>
                  <h5> DELIVERED</h5>
                  Your order has been delivered on {order.deliveredAt}
                </Meassage>
              ) :(
                <Meassage variant='primary'>
                  <h5> AWAITING DELIVERY</h5>
                  Your Order is being processed
                </Meassage>
              )}
              {order.isShipped ?(
                <Meassage variant='success'>
                  <h5>IN TRANSIT</h5>
                  Your order is in transit {order.shippedAt}
                </Meassage>
              ) :(
                <Meassage variant='primary'>
                  <h5>NOT IN TRANSIT </h5>
                  Your Order will soon be shipped after payment has been confirmed
                </Meassage>
              )}
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Payment With</h2>
            <p>
                <strong> Method : </strong>{order.paymentMethod}
            </p>
            {order.awaitingPayment ?(
                <Meassage variant='success'>
                <h5>  PAYMENT CONFIRMED  </h5>
                 Your order's payment was confirmed on {order.paidAt}
                </Meassage>
              ) :(
                <Meassage variant='warning'>
                  <h5>  AWAITING CONFIRMATION </h5>
                 We are waiting for the confirmation of your payment
              </Meassage>
              )}
               {order.isPaid ?(
                <Meassage variant='success'>
                  <h5> Already Paid</h5>
                  We are waiting for the confirmation of your payment {order.awaitingPaymentAt}
                Please Do Ensure That You Have made Your Payment Before Clicking on The "I'have Paid" button
                </Meassage>
              ) :(
                <Meassage variant='warning'>
                  <h5>AWAITING PAYMENT</h5>
                  We Are Yet To Recieve Your Payment
                </Meassage>
              )}
          </ListGroup.Item>
          <ListGroup.Item>
            <h2> Order Item</h2>
              {order.orderItems.map((item, index) =>(
               <container key={ item._id} className='cart-design'>
                            <Col >
                                <div className='cart-img'>
                                    <Image src={item.images && item.images.length > 0 ? item.images[0] :''} alt ={item.name} fluid rounded />
                                </div>
                                </Col>
                                <Col>
                                <div className="lato-boldee" > 
                                    <Link to={`/product/${item._id}`} className="text-decoration-none link-primary ">Name: { item.name} </Link>
                                </div> 
                                <div className=" lato-boldee">
                                    Size: <span></span>
                                <span> 
                                    {item.sizes}</span>
                                </div>
                                <div className="lato-boldee"> 
                                   Price: <span></span>  {currency(item.price, { symbol: '₦', formatWithSymbol: true }).format()}
                                </div>
                                <div className='lato-boldee'>
                                  Quantity:   { item.qty } 
                                    <br />
                                    <br />  
                                    Item(s) Total : {currency(item.price*item.qty, { symbol: '₦', formatWithSymbol: true }).format()}
                                  </div>
                                  <div className='lato-boldee'>
                                  Shipping Amount =  {currency(item.shippingAmount, { symbol: '₦', formatWithSymbol: true }).format()}
                                  </div>
                               
                            </Col>
                        </container>
              ))}  
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col xs={12} md={4}>
        <Card>
        <ListGroup  >
          <ListGroup.Item>Order Summary</ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col> Items</Col>
              <Col>{currency(order.itemsPrice, { symbol: '₦', formatWithSymbol: true }).format()}</Col>
            </Row>
            <Row>
              <Col> Shipping </Col>
              <Col>{currency(order.shippingPrice, { symbol: '₦', formatWithSymbol: true }).format()}</Col>
            </Row>
            <Row>
              <Col> VAT</Col>
              <Col>{currency(order.taxPrice, { symbol: '₦', formatWithSymbol: true }).format()}</Col>
            </Row>
            <Row>
              <Col> Total </Col>
              <Col>{currency(order.totalPrice, { symbol: '₦', formatWithSymbol: true }).format()}</Col>
            </Row>
          </ListGroup.Item>
          { ! order.isPaid &&(
            <ListGroup.Item>
              {loadingPay && <Loader />}
              { isPending ? <Loader />: (
                <div>
                  <h5>
                    Our Account Detail:<br /> 
                    Bank : WEMA BANK ,<br />
                     Account Number : 0419807621 , <br />
                    Beneficiary Name: Oluwafeyikemi Delight Adeniran



                  </h5>
                 <Button onClick={onApproveTest} style={{marginBottom:"10px"}}>I'have Paid </Button>
                  {/* <div>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}></PayPalButtons>
                  </div> */}
                </div>
              )}
            </ListGroup.Item>
          )}
          
          { loadingAwaitingPayment && loadingShipping && loadingDeliver && <Loader /> }
             {userInfo && userInfo.isAdmin  && order.isPaid && !order.awaitingPayment && (
              <ListGroup.Item >   
                <Button
                type='button'
                className='btn btn-block mb-4'
                onClick={ConfirmPaymentHandler}
                >
                  Confirm Payment
                </Button> 
                 </ListGroup.Item>
             )}   
             {userInfo && userInfo.isAdmin  && order.isPaid && order.awaitingPayment && !order.isShipped && (
              <ListGroup.Item>
                <Button
                type='button'
                className='btn btn-block mb-4'
                onClick={ShippingItems}
                >
                  Confirm Item is Out for Delivery
                </Button>
                 </ListGroup.Item>
                   )}  
                 {userInfo && userInfo.isAdmin  && order.isPaid && order.awaitingPayment && order.isShipped && !order.isDelivered && (
                  <ListGroup.Item>
                <Button
                type='button'
                className='btn btn-block mb-4'
                onClick={deliverOrderHandler}
                >
                  Confirm Item is Delivered
                </Button>
                </ListGroup.Item>
                 )}
           
        </ListGroup> 
        </Card>
      </Col>
     </Row>
    </>
  )
}

export default OrderScreen