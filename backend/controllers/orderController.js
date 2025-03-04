import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModal.js'
import nodemailer from 'nodemailer';


// @descrp   create new order 
// @route    POST/api/orders
// @access    Private
const addOrderItems  = asyncHandler(async (req, res) => {
 const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
 }  = req.body

    if(orderItems && orderItems.length === 0){
        res.status(400)
        throw new Error('no order items')
    }else{
        const order = new Order({
        orderItems: orderItems.map((x) => ({
            ...x,
            product: x._id,
            _id: undefined
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        })   
        
        const createOrder = await order.save();

        res.status(201).json(createOrder);
    }
 
 });

// @descrp   get logged in users order
// @route    GET/api/orders/myorders
// @access    Private
const getMyOrders = asyncHandler(async (req, res) => {
   const orders = await Order.find({ user: req.user._id})
   res.status(200).json(orders);
   
 });

// @descrp   get logged in users order
// @route    GET/api/orders/:id
// @access    Private
const getOrderById = asyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id).populate('user', 'name email phone')
   if(order){
    res.status(200).json(order)
   }else{
    res.status(404)
    throw new Error('Order not found')
   }
 });

 // @descrp  update order to pay
// @route    GET/api/orders/:id/pay
// @access    Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id)

   if(order){
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
         id: req.body.id,
         status: req.body.status,
         update_time: req.body.update_time,
         email_address: req.body.email_address,
      }
      const updateOrder = await order.save();
     
      res.status(200).json(updateOrder)
   } else {
      res.status(404);
      throw new Error('Order does not exist')
   }
 
 });

 // @descrp  update order to delivered
// @route    GET/api/orders/:id/deliver
// @access    Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id).sort({createdAt : -1}).populate('user', 'name email phone')
   ;
      if (order) {
         order.isDelivered = true;
         order.deliveredAt = Date.now()

         const updateOrder = await order.save();
         const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
        });
        if (!order.user || !order.user.email) {
         console.error('No recipient email defined for order:', order.user);
         return res.status(400).json({ message: 'No recipient email defined' });
     }
      
        const mailOptions = {
            from : process.env.EMAIL_USER,
            to: order.user.email,
            subject: `Order Delivered: ${order._id}` ,
            text: `Hello ${order.user.name},\n\nYour KEMSKULTURE order ${order._id} . has been successfully delivered! We hope you love your new pieces and that they make you feel as confident and elegant as ever.  

            \n\nWe’d love to hear your thoughts! Your feedback helps us improve and lets others know what to expect. Please take a moment to leave a review on our website 
         
            \n\nIf you have any questions or need assistance, feel free to reach out at [support email]. Thank you for being a part of KEMSKULTURE!  
            
            With love,
            The KEMSKULTURE Team  
            ` ,
        };
      
         // Send the email using async/await
         try {
            await transporter.sendMail(mailOptions);
            // Send success response after email is sent
            res.status(200).json({ message: 'Order has been deliverd and email sent', order: updateOrder });
        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email' });
        }
    } else {
        res.status(404);
        throw new Error('Order does not exist');
    }
});

 // @descrp  update order to delivered
// @route    GET/api/orders/:id/deliver
// @access    Private/Admin
const updateOrderToAwaitingPayment = asyncHandler(async (req, res) => {

   const order = await Order.findById(req.params.id).populate('user', 'name email phone');
      if (order) {
         order.awaitingPayment = true;
         order.awaitingPaymentAt = Date.now()

         const updateOrder = await order.save();
         const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
        });
        if (!order.user || !order.user.email) {
         console.error('No recipient email defined for order:', order.user);
         return res.status(400).json({ message: 'No recipient email defined' });
     }
      
        const mailOptions = {
         from : process.env.EMAIL_USER,
            to: order.user.email,
            subject: `Hi ${order.user.email} Payment Confirmed – Your Order is Being Processed!` ,
            text: `Subject:***

            Dear ${order.user.name},  
            
            \n\nWe’ve received your payment for ${order.id}, and our team is already preparing your items with care.  
            
           
            \n\n We’ll update you once your order ships. If you need any assistance, reach out to us at [support email].  
            
            \n\nThank you for choosing KEMSKULTURE!  
            
            \n\n Best,
            \n\n KEMSKULTURE Team
            ` ,
        };
      
       // Send the email using async/await
       try {
         await transporter.sendMail(mailOptions);
         // Send success response after email is sent
         res.status(200).json({ message: 'Order Payment has been confirmed and email sent', order: updateOrder });
     } catch (error) {
         console.error('Error sending email:', error);
         return res.status(500).json({ message: 'Error sending email' });
     }
 } else {
     res.status(404);
     throw new Error('Order does not exist');
 }
});

 // @descrp  update order to delivered
// @route    GET/api/orders/:id/deliver
// @access    Private/Admin
const updateOrderToShipped = asyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id).populate('user', 'name email phone');
      if (order) {
         order.isShipped = true;
         order.shippedAt = Date.now()

         const updateOrder = await order.save();
         const transporter = nodemailer.createTransport({
         service: 'Gmail',
         auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PASS,
         },
     });
     if (!order.user || !order.user.email) {
      console.error('No recipient email defined for order:', order.user);
      return res.status(400).json({ message: 'No recipient email defined' });
  }
     const mailOptions = {
      from : process.env.EMAIL_USER,
         to: order.user.email,
         subject: `Hi ${order.user.email}` ,
         text: `Hello ${order.user.name},\n\nYour order ${order._id}  Your Order is On the Way!, Please keep your phone line available for delivery. If you have any questions, feel free to reach out at [support email]. 
         \n\nPlease note that your order might take up to a day to 7days before getting to your destination, depending on where you are ordering our product(s) from. 
            Please exercise patience with us. for further details and you can contact us.
         
         \n\n Can’t wait for you to receive your pieces!  
         
         With love, 
         KEMSKULTURE Team 
         .`  ,
     };
   
      // Send the email using async/await
      try {
         await transporter.sendMail(mailOptions);
         // Send success response after email is sent
         res.status(200).json({ message: 'Order has been shipped and email sent', order: updateOrder });
     } catch (error) {
         console.error('Error sending email:', error);
         return res.status(500).json({ message: 'Error sending email' });
     }
 } else {
     res.status(404);
     throw new Error('Order does not exist');
 }
});
 // @descrp  Get all oders
// @route    GET/api/orders/:id/deliver
// @access    Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const order = await Order.find({}).populate('user', 'id name').sort({createdAt : -1})

  res.status(200).json(order)
 });

 export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToAwaitingPayment,
    updateOrderToShipped,
    updateOrderToDelivered,
    getAllOrders
 };
