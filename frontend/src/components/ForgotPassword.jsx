import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';



const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [forgotPassword, { isLoading, isError, isSuccess, error }] = useForgotPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            toast.success('password was sent to the mail') 
        } catch (err) {
            toast.error(err.data.message ||'an error occured')
        }
        
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <Form onSubmit={handleSubmit}>
            <Form.Group  controlId='email' className='my-2 w-50'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                >

                </Form.Control>
            </Form.Group>
                <Button  type="submit" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </Form>
            {isSuccess && <p>Password reset link sent to your email.</p>}
            {isError && <p>{error.data.message || 'An error occurred.'}</p>}
        </div>
    );
};

export default ForgotPassword;