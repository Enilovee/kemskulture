import React from 'react'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/Scroll'
const App = () => {
  return (
    <> 
    <Header />
    <ScrollToTop />
      <main className='py-3'>
        <Container>
         <Outlet />
        </Container>
      </main>
      <ToastContainer />
      <Footer />
    </>
  )
}

export default App