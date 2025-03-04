import React, { useState } from 'react';
import { useResetPasswordMutation } from '../slices/usersApiSlice';
import { toast } from "react-toastify"
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';



 const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);

    }
      const { token } = useParams();
  
  const navigate = useNavigate();

  const [resetPassword, { isLoading, isSuccess, isError }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword){
        toast.error('Password do not match')
        return;
      } else {
    try {
          await resetPassword({ token, newPassword }).unwrap();
         navigate('/login')
        toast.success('password reset successfully')
    } catch (err) {
        toast.error(err?.data?.message || 'error resetting password')
    }
 }
  };

  return (
    <div className='flex'>
      <h2>Reset Password</h2>
      <Form onSubmit={handleSubmit} >
        <Form.Group  controlId='newPassword' className='my-2 w-25'>
                <Form.Label>New Password</Form.Label>
                <div className="input-group">
                <Form.Control
                   type={showPassword ? 'text' : 'password'}
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                   placeholder="Enter new password"
                >
                 
                </Form.Control>
              
              <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              
                </div>

            </Form.Group>
            <Form.Group controlId='confirmNewPassword' className='my-2 w-25' >
                <Form.Label>Confirm Password</Form.Label>
                <div className="input-group">
                <Form.Control
                   type={showPassword ? 'text' : 'password'}
                   value={confirmNewPassword}
                   onChange={(e) => setConfirmNewPassword(e.target.value)}
                   placeholder="Enter new password"
                >

                </Form.Control>
                 
              <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
                </div>
            </Form.Group>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </Form>
      {isSuccess && <p>Password has been reset successfully!</p>}
      {isError && <p>Error resetting password. Please try again.</p>}
    </div>
  );
};

export default ResetPassword;