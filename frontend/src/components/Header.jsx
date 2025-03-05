import { useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap'
import{  FaBlog,  FaBookOpen,  FaShoppingBasket,  FaSquareFull,  FaUser, FaUserCheck, FaUserCircle, FaUserSlash}  from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import logo from '../assets/LOGO 01.jpg'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { logout} from '../slices/authSlice'
import SearchBox from './SearchBox'
import { resetCart } from '../slices/cartSlice'
import { useState } from 'react'


const Header = () => {
  const { cartItems } = useSelector((state) => state.cart)
  const { userInfo } = useSelector((state) => state.auth)

const dispatch = useDispatch()
const navigate = useNavigate()
const [logoutApiCall] = useLogoutMutation()

const [activeLink, setActiveLink] = useState('home');

const logoutHandler = async () =>{
    try {
      await logoutApiCall().unwrap();
      dispatch(logout())
      dispatch(resetCart())
      navigate('/login')
    } catch (err) {
      console.log(err);
    }
}

const handleLinkClick = (link) => {
  setActiveLink(link); // Update active link
};

  return (
    
    <header>
        <Navbar style={{ background:"ivory", color:'#462b03', width:'100%'}} variant='outline-secondary' expand='lg' collapseOnSelect  >
            <Container className='navMenu'>
               <LinkContainer to ='/'> 
              
            <Navbar.Brand >
            <img src={logo} alt="phinny store" className='logo' /> 
              <strong > KemsKulture  </strong>
              </Navbar.Brand>
              </LinkContainer> 
              
            <Navbar.Toggle aria-controls="basic-navbar-nav" style={{margin: '18px'}}/>
            <Navbar.Collapse>
                <Nav className="ms-auto">
                 <div className="searc"> <SearchBox /></div>
                  <LinkContainer to='/blog-posts' style={{marginLeft:"4px"}}>
                <Nav.Link
                  onClick={() => handleLinkClick('blog')}
                  className={activeLink === 'blog-posts' ? 'active' : ''}
                >
                  <span className='lato-lightR'>Blog</span>
                </Nav.Link>
              </LinkContainer>
                  <LinkContainer to='/products' style={{marginLeft:"-5px"}}>
                <Nav.Link
                  onClick={() => handleLinkClick('products')}
                  className={activeLink === 'products' ? 'active' : ''}
                >
                  <span className='lato-lightR'>Products</span>
                </Nav.Link>
              </LinkContainer>
                    <LinkContainer to='/cart' style={{marginLeft:"-8px"}}>
                      <Nav.Link 
                      onClick={() => handleLinkClick('cart')}
                      className={activeLink === 'cart' ? 'active' : ''}>
                        <FaShoppingBasket/> Basket
                        { 
                        cartItems.length > 0 && (
                         < Badge pill bg='light' style = {{marginLeft:"5px", color:'teal'}} >
                            { cartItems.reduce((acc, cur) => acc + cur.qty, 0) }
                         </Badge>
                        )}
                        </Nav.Link>
                        </LinkContainer>
                        { userInfo ? (
                          <NavDropdown title={userInfo.name} id='username' style={{marginLeft:"10px"}}>
                            <LinkContainer to='/profile'>
                              <NavDropdown.Item onClick={() => handleLinkClick('profile')}>
                                <FaUserCheck /> Profile
                                </NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Item onClick={logoutHandler}>
                                <FaUserSlash /> Logout
                            </NavDropdown.Item>
                          </NavDropdown>
                        ) : ( <LinkContainer to ='/login'>
                          <Nav.Link href='/login' 
                           onClick={() => handleLinkClick('login')}
                           className={activeLink === 'login' ? 'active' : ''}>
                        <FaUser/> Sign in
                      </Nav.Link>
                    </LinkContainer>
                    )}
                   {userInfo && userInfo.isAdmin && (
                    <NavDropdown title ='Admin' id ='adminmenu'>
                      <LinkContainer to='/admin/bloglist'>
                      <NavDropdown.Item 
                       onClick={() => handleLinkClick('admin-blogPost')}
                      > <FaBlog /> blogPosts</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/productlist'>
                      <NavDropdown.Item 
                       onClick={() => handleLinkClick('admin-products')}
                      > <FaSquareFull /> products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/userlist'>
                      <NavDropdown.Item
                      onClick={() => handleLinkClick('admin-users')}
                      > <FaUserCircle /> Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/orderlist'>
                      <NavDropdown.Item
                      onClick={() => handleLinkClick('admin-orders')}
                      ><FaBookOpen /> Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                   )}
                      
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )

}

export default Header