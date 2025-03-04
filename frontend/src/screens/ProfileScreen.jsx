import React, {useState, useEffect} from 'react'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { LinkContainer } from 'react-router-bootstrap'
import Meassage from '../components/Meassage'
import Loader from '../components/Loader'
import { useProfileMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice'
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa'


const ProfileScreen = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
  
      }

    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth)

    const [updateProfile, {isLoading:loadingUpdateProfile, }] = useProfileMutation();
    const { data: orders, isLoading, error} = useGetMyOrdersQuery();

    useEffect(() =>{
        if(userInfo){
            setName(userInfo.name);
            setEmail(userInfo.email);
            setPhone(userInfo.phone);
        }
    },[userInfo, userInfo.name, userInfo.email, userInfo.phone])

    const submitHandler =  async (e) => {
        e.preventDefault()
        if( password !== confirmPassword){
            toast.error("Password do not match")
        } else {
            try {
                const res = await updateProfile({ _id: userInfo._id, name, email, phone, password }).unwrap();
                dispatch(setCredentials(res))
                toast.success('Profile updated Successfully')
            } catch (err) {
                toast.error(err?.data?.message || err?.error )
            }
        }
    }

  return (
    <Row>
        <Col md={3}>
            <h2>User Profile</h2>

            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name' className='my-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                   type='name' 
                   placeholder='Enter name'
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   ></Form.Control>
              </Form.Group>
              <Form.Group controlId='email' className='my-2'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                   type='email' 
                   placeholder='Enter email'
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   ></Form.Control>
              </Form.Group>
              <Form.Group controlId='phone' className='my-2'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                   type='tel' 
                   placeholder='Enter phone number'
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   ></Form.Control>
              </Form.Group>
              <Form.Group controlId= 'password' className="my-3 ">
          <Form.Label>Password</Form.Label>
           <div className="input-group">
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Using react-icons */}
          </Button>
        </div>
        </Form.Group> 
        <Form.Group controlId= 'confirmPassword' className="my-3 ">
            <Form.Label> Confirm Password </Form.Label>
            <div className="input-group">
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Using react-icons */}
          </Button>
        </div>
            
        </Form.Group> 
              <Button type='submit' variant='primary' className='my-2'>
                Update Profile
              </Button>
              { loadingUpdateProfile && <Loader />}
            </Form>
        </Col>
        <Col md={9}>
            <h2> My Orders</h2>
            { isLoading ? (<Loader />) : error ? (<Meassage variant='danger' >
                {error?.data?.message || error.error}
            </Meassage>): (
                <Table  hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice}</td>
                                <td>
                                    {order.isPaid? (
                                        order.paidAt.substring(0, 10)
                                    ) : (
                                        <FaTimes style={{ color: 'red'}} />
                                    )}
                                </td>
                                <td>
                                    {order.isDelivered? (
                                        order.deliveredAt.substring(0, 10)
                                    ) : (
                                        <FaTimes style={{ color: 'red'}} />
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button className='btn-sm' variant ='light'>
                                            Details 
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Col>
    </Row>
  )
}

export default ProfileScreen