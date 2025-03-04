import { Row, Col} from "react-bootstrap"
import { FaFacebook, FaInstagramSquare,  FaTiktok,  FaWhatsappSquare } from "react-icons/fa"
import { Link } from "react-router-dom"

const Footer = () => {
    const currentYear = new Date().getFullYear()
  return (
    <footer className="footer-container">
            
    <div className="footer-details">
        <div className="">
          <h3>CONTACT US</h3>
          <h4>Address</h4>
          <p>Street:  25 Charles Amu Street, Bolade,<br />
              City:  Oshodi, Lagos <br />
              Zip code:  100261 <br />
              Country:  Nigeria</p>
        </div>
        <div className=''>
          <h4>Hours</h4>
          <p>Mon - Fri: 9am - 8pm <br />
            Sat: 10am - 5pm <br />
            Sun: 12pm - 6pm</p>
        </div>
        <div className="">
          <h4>Phone Number</h4>
          <p> +234 0810 281 6649</p>
        </div>
        <div className="">
      <h1  style={{ fontSize: '36px', fontWeight: 'bold' }}> <Link to =' https://www.instagram.com/kemskulture' className='text-decoration-none'><FaInstagramSquare /></Link> <Link to ='https://www.facebook.com/kemskulture' className='text-decoration-none'><FaFacebook /></Link> <Link to ='/' className='text-decoration-none'><FaTiktok /></Link> <Link to ='https://wa.me/2348102816649' className='text-decoration-none'><FaWhatsappSquare /></Link></h1>
      </div>
  
  /</div>
  <Row>
  <Col className="text-center py-3">
    <p>Phinny's Store &copy; {currentYear} </p>
     </Col>
         </Row>
    </footer>
  )
}

export default Footer