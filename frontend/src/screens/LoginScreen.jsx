import { useState, useEffect } from "react"
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { Form, Button, Row, Col } from "react-bootstrap"
import FormContainer from "../components/FormContainer"
import { useDispatch, useSelector } from "react-redux"
import Loader from '../components/Loader'

import { useLoginMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { toast } from "react-toastify"
import { FaEye, FaEyeSlash } from "react-icons/fa"



const LoginScreen = () => {
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, {isLoading }] = useLoginMutation(); 

  const {userInfo } = useSelector((state) => state.auth )

  const { search } = useLocation();
  const sp = new URLSearchParams(search)
  const redirect  = sp.get('redirect') || '/'

    useEffect(() => {
      if(userInfo){ navigate(redirect)}
    }, [userInfo, redirect, navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
      try {
        const res = await login({ email, password }).unwrap();
        dispatch(setCredentials({...res }));
        navigate(redirect)
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
  }
    
  return (
    <FormContainer>
        <h1>Sign In</h1>

        <Form onSubmit={submitHandler}>
        <Form.Group controlId= 'email' className="my-3 ">
            <Form.Label> Email Address</Form.Label>
            <Form.Control
            type="email"
            placeholder="Enter Email"
            value = {email}
            onChange = {(e) => setEmail(e.target.value)}
            >
            </Form.Control>
            </Form.Group>


        <Form.Group controlId= 'password' className="my-3 ">
            <Form.Label> Password </Form.Label>
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
            <Button type="submit" variant='primary' className="mt-2" disabled ={isLoading}>
                Sign In
            </Button>
              {isLoading && <Loader />}
              <Col className="py-2">
            Can't Remember Password  ?  <Link to={ redirect ? `/forgot-password?redirect=${redirect}`: '/forgot-password'}>Forgot Password</Link>
            </Col>
              </Form>
        <Row className="py-3">
            <Col>
            New Customer ?  <Link to={ redirect ? `/register?redirect=${redirect}`: '/register'}>Register</Link>
            </Col>
        </Row>

      

    </FormContainer>


  )
}

export default LoginScreen