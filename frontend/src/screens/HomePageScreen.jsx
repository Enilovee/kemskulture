import React from 'react'
import {  Button, Container, Image } from 'react-bootstrap'
import pic31 from '../assets/pic2.jpg'
import pic27 from '../assets/pic1.jpg'
import { Link } from 'react-router-dom'
import HomeBlog from '../components/HomeBlog'
import ProductCarousel from '../components/ProductCarousel'


const 
HomePageScreen = () => {

  
  return (
    <Container className='homeCont' >
      <section className='firstSect'>
      <Link to={'/products'} style={{ textDecoration:"none"}}  >
        <div className="homeSect1">
      <Image  src={pic31} className='homeImg1'/>
      <div className="lay"> <div style={{marginTop:"40px"}}> Welcome   To   KemsKulture</div> <b /> <h2>Create a vibe that exudes elegance with the sophistication that speaks volumes</h2>         <Button className='text-black border-2 rounded-5 ' variant='outline-secondary'>Shop Now</Button>
 </div>
      </div>
      </Link>
      </section>
      
      
      <section className="fourthSect">
        <div className="featured"> <h1 >Blog Post</h1> </div>
       
       <HomeBlog /> 
       <p style={{ display:"flex", marginLeft:"40px", justifySelf:'center', alignSelf:"center"}} >To keep up with the latest fashion trends and designs click the button below   </p>
 <Link to ={'/blog-posts'} className='text-decoration-none'>
       <Button className='fourthLink' variant='outline-light ml'> click </Button></Link>
      
      </section>
      <section className='secondSect'>
        <div className="featured"> <h1 > Top Rated Products</h1></div>
       
        <ProductCarousel />
      
      </section>
      <section className='thirdSect'> 
      <h4 className='text-primary'>We At KemsKulture </h4>
        <Image src={pic27} className='thirdSect-img'  />
         <h5 style={{marginLeft:"30px"}}>Kemskulture was born from this vision, driven by a desire to make people feel expensive and confident in their simplicity. While our rich culture beautifully inspires many brands in Nigeria, my inspiration comes from a deeper place—feelings, emotions, art, and the essence of confidence. At Kemskulture, it's not just about fashion; it’s about creating a vibe that exudes elegance and an understated sophistication that speaks volumes.
</h5>
      </section>
    </Container>
  )
}

export default 
HomePageScreen