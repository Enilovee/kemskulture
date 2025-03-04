import { useState, useEffect } from "react"
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { Form, Button, Row, Col } from "react-bootstrap"
import FormContainer from "../components/FormContainer"
import { useDispatch, useSelector } from "react-redux"
import Loader from '../components/Loader'
import { useRegisterMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { toast } from "react-toastify"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const countryCodes = [
  { "name": "Afghanistan", "code": "+93", "national_code": "00" },
  { "name": "Albania", "code": "+355", "national_code": "00" },
  { "name": "Algeria", "code": "+213", "national_code": "00" },
  { "name": "American Samoa", "code": "+1", "national_code": "684" },
  { "name": "Andorra", "code": "+376", "national_code": "00" },
  { "name": "Angola", "code": "+244", "national_code": "00" },
  { "name": "Anguilla", "code": "+1", "national_code": "264" },
  { "name": "Antigua and Barbuda", "code": "+1", "national_code": "268" },
  { "name": "Argentina", "code": "+54", "national_code": "00" },
  { "name": "Armenia", "code": "+374", "national_code": "00" },
  { "name": "Aruba", "code": "+297", "national_code": "00" },
  { "name": "Australia", "code": "+61", "national_code": "0011" },
  { "name": "Austria", "code": "+43", "national_code": "00" },
  { "name": "Azerbaijan", "code": "+994", "national_code": "810" },
  { "name": "Bahamas", "code": "+1", "national_code": "242" },
  { "name": "Bahrain", "code": "+973", "national_code": "00" },
  { "name": "Bangladesh", "code": "+880", "national_code": "00" },
  { "name": "Barbados", "code": "+1", "national_code": "246" },
  { "name": "Belarus", "code": "+375", "national_code": "810" },
  { "name": "Belgium", "code": "+32", "national_code": "00" },
  { "name": "Belize", "code": "+501", "national_code": "00" },
  { "name": "Benin", "code": "+229", "national_code": "00" },
  { "name": "Bermuda", "code": "+1", "national_code": "441" },
  { "name": "Bhutan", "code": "+975", "national_code": "00" },
  { "name": "Bolivia", "code": "+591", "national_code": "0010" },
  { "name": "Bosnia and Herzegovina", "code": "+387", "national_code": "00" },
  { "name": "Botswana", "code": "+267", "national_code": "00" },
  { "name": "Brazil", "code": "+55", "national_code": "0014" },
  { "name": "Brunei Darussalam", "code": "+673", "national_code": "00" },
  { "name": "Bulgaria", "code": "+359", "national_code": "00" },
  { "name": "Burkina Faso", "code": "+226", "national_code": "00" },
  { "name": "Burundi", "code": "+257", "national_code": "00" },
  { "name": "Cambodia", "code": "+855", "national_code": "00" },
  { "name": "Cameroon", "code": "+237", "national_code": "00" },
  { "name": "Canada", "code": "+1", "national_code": "011" },
  { "name": "Cape Verde", "code": "+238", "national_code": "00" },
  { "name": "Cayman Islands", "code": "+1", "national_code": "345" },
  { "name": "Central African Republic", "code": "+236", "national_code": "00" },
  { "name": "Chad", "code": "+235", "national_code": "15" },
  { "name": "Chile", "code": "+56", "national_code": "00" },
  { "name": "China", "code": "+86", "national_code": "00" },
  { "name": "Christmas Island", "code": "+61", "national_code": "8" },
  { "name ": "Cocos (Keeling) Islands", "code": "+61", "national_code": "8" },
  { "name": "Colombia", "code": "+57", "national_code": "005" },
  { "name": "Comoros", "code": "+269", "national_code": "00" },
  { "name": "Congo (Brazzaville)", "code": "+242", "national_code": "00" },
  { "name": "Congo (Kinshasa)", "code": "+243", "national_code": "00" },
  { "name": "Cook Islands", "code": "+682", "national_code": "00" },
  { "name": "Costa Rica", "code": "+506", "national_code": "00" },
  { "name": "Côte D'Ivoire (Ivory Coast)", "code": "+225", "national_code": "00" },
  { "name": "Croatia (Hrvatska)", "code": "+385", "national_code": "00" },
  { "name": "Cuba", "code": "+53", "national_code": "119" },
  { "name": "Cyprus", "code": "+357", "national_code": "00" },
  { "name": "Czech Republic", "code": "+420", "national_code": "00" },
  { "name": "Denmark", "code": "+45", "national_code": "00" },
  { "name": "Djibouti", "code": "+253", "national_code": "00" },
  { "name": "Dominica", "code": "+1", "national_code": "767" },
  { "name": "Dominican Republic", "code": "+1", "national_code": "809, 829, 849" },
  { "name": "Ecuador", "code": "+593", "national_code": "00" },
  { "name": "Egypt", "code": "+20", "national_code": "00" },
  { "name": "El Salvador", "code": "+503", "national_code": "00" },
  { "name": "Equatorial Guinea", "code": "+240", "national_code": "00" },
  { "name": "Eritrea", "code": "+291", "national_code": "00" },
  { "name": "Estonia", "code": "+372", "national_code": "00" },
  { "name": "Ethiopia", "code": "+251", "national_code": "00" },
  { "name": "Falkland Islands (Malvinas)", "code": "+500", "national_code": "00" },
  { "name": "Faroe Islands", "code": "+298", "national_code": "00" },
  { "name": "Fiji", "code": "+679", "national_code": "00" },
  { "name": "Finland", "code": "+358", "national_code": "00" },
  { "name": "France", "code": "+33", "national_code": "00" },
  { "name": "French Guiana", "code": "+594", "national_code": "00" },
  { "name": "French Polynesia", "code": "+689", "national_code": "00" },
  { "name": "Gabon", "code": "+241", "national_code": "00" },
  { "name": "Gambia", "code": "+220", "national_code": "00" },
  { "name": "Georgia", "code": "+995", "national_code": "810" },
  { "name": "Germany", "code": "+49", "national_code": "00" },
  { "name": "Ghana", "code": "+233", "national_code": "00" },
  { "name": "Gibraltar", "code": "+350", "national_code": "00" },
  { "name": "Greece", "code": "+30", "national_code": "00" },
  { "name": "Greenland", "code": "+299", "national_code": "009" },
  { "name": "Grenada", "code": "+1", "national_code": "473" },
  { "name": "Guadeloupe", "code": "+590", "national_code": "00" },
  { "name": "Guam", "code": "+1", "national_code": "671" },
  { "name": "Guatemala", "code": "+502", "national_code": "00" },
  { "name": "Guinea", "code": "+224", "national_code": " 00" },
  { "name": "Guinea-Bissau", "code": "+245", "national_code": "00" },
  { "name": "Guyana", "code": "+592", "national_code": "00" },
  { "name": "Haiti", "code": "+509", "national_code": "00" },
  { "name": "Holy See (Vatican City State)", "code": "+379", "national_code": "00" },
  { "name": "Honduras", "code": "+504", "national_code": "00" },
  { "name": "Hong Kong, SAR", "code": "+852", "national_code": "001" },
  { "name": "Hungary", "code": "+36", "national_code": "00" },
  { "name": "Iceland", "code": "+354", "national_code": "00" },
  { "name": "India", "code": "+91", "national_code": "00" },
  { "name": "Indonesia", "code": "+62", "national_code": "001" },
  { "name": "Iran, Islamic Republic of", "code": "+98", "national_code": "00" },
  { "name": "Iraq", "code": "+964", "national_code": "00" },
  { "name": "Ireland", "code": "+353", "national_code": "00" },
  { "name": "Israel", "code": "+972", "national_code": "00" },
  { "name": "Italy", "code": "+39", "national_code": "00" },
  { "name": "Jamaica", "code": "+1", "national_code": "876" },
  { "name": "Japan", "code": "+81", "national_code": "010" },
  { "name": "Jordan", "code": "+962", "national_code": "00" },
  { "name": "Kazakhstan", "code": "+7", "national_code": "6, or 7" },
  { "name": "Kenya", "code": "+254", "national_code": "000" },
  { "name": "Kiribati", "code": "+686", "national_code": "00" },
  { "name": "Korea, Democratic People's Republic of (North)", "code": "+850", "national_code": "00" },
  { "name": "Korea, Republic of (South)", "code": "+82", "national_code": "001" },
  { "name": "Kuwait", "code": "+965", "national_code": "00" },
  { "name": "Kyrgyzstan", "code": "+996", "national_code": "00" },
  { "name": "Laos (Lao PDR)", "code": "+856", "national_code": "00" },
  { "name": "Latvia", "code": "+371", "national_code": "00" },
  { "name": "Lebanon", "code": "+961", "national_code": "00" },
  { "name": "Lesotho", "code": "+266", "national_code": "00" },
  { "name": "Liberia", "code": "+231", "national_code": "00" },
  { "name": "Libya", "code": "+218", "national_code": "00" },
  { "name": "Liechtenstein", "code": "+423", "national_code": "00" },
  { "name": "Lithuania", "code": "+370", "national_code": "00" },
  { "name": "Luxembourg", "code": "+352", "national_code": "00" },
  { "name": "Macao (SAR China)", "code": "+853", "national_code": "00" },
  { "name": "Macedonia, Republic of", "code": "+389", "national_code": "00" },
  { "name": "Madagascar", "code": "+261", "national_code": "00" },
  { "name": "Malawi", "code": "+265", "national_code": "00" },
  { "name": "Malaysia", "code": "+60", "national_code": "00" },
  { "name": "Maldives", "code": "+960", "national_code": "00" },
  { "name": "Mali", "code": "+223", "national_code": "00" },
  { "name": "Malta", "code": "+356", "national_code": "00" },
  { "name": "Marshall Islands", "code ": "+692", "national_code": "00" },
  { "name": "Martinique", "code": "+596", "national_code": "00" },
  { "name": "Mauritania", "code": "+222", "national_code": "00" },
  { "name": "Mauritius", "code": "+230", "national_code": "020" },
  { "name": "Mayotte", "code": "+262", "national_code": "00" },
  { "name": "Mexico", "code": "+52", "national_code": "00" },
  { "name": "Micronesia, Federated States of", "code": "+691", "national_code": "011" },
  { "name": "Moldova", "code": "+373", "national_code": "00" },
  { "name": "Monaco", "code": "+377", "national_code": "00" },
  { "name": "Mongolia", "code": "+976", "national_code": "001" },
  { "name": "Montenegro", "code": "+382", "national_code": "99" },
  { "name": "Montserrat", "code": "+1", "national_code": "664" },
  { "name": "Morocco and Western Sahara", "code": "+212", "national_code": "00" },
  { "name": "Mozambique", "code": "+258", "national_code": "00" },
  { "name": "Myanmar", "code": "+95", "national_code": "00" },
  { "name": "Namibia", "code": "+264", "national_code": "00" },
  { "name": "Nauru", "code": "+674", "national_code": "00" },
  { "name": "Nepal", "code": "+977", "national_code": "00" },
  { "name": "Netherlands", "code": "+31", "national_code": "00" },
  { "name": "Netherlands Antilles", "code": "+599", "national_code": "00" },
  { "name": "New Caledonia", "code": "+687", "national_code": "00" },
  { "name": "New Zealand", "code": "+64", "national_code": "00" },
  { "name": "Nicaragua", "code": "+505", "national_code": "00" },
  { "name": "Niger", "code": "+227", "national_code": "00" },
  { "name": "Nigeria", "code": "+234", "national_code": "009" },
  { "name": "Niue", "code": "+683", "national_code": "00" },
  { "name": "Norfolk Island", "code": "+672", "national_code": "00" },
  { "name": "Northern Mariana Islands", "code": "+1", "national_code": "670" },
  { "name": "Norway", "code": "+47", "national_code": "00" },
  { "name": "Oman", "code": "+968", "national_code": "00" },
  { "name": "Pakistan", "code": "+92", "national_code": "00" },
  { "name": "Palau", "code": "+680", "national_code": "00" },
  { "name": "Palestinian Territory, Occupied", "code": "+970", "national_code": "00" },
  { "name": "Panama", "code": "+507", "national_code": "00" },
  { "name": "Papua New Guinea", "code": "+675", "national_code": "05" },
  { "name": "Paraguay", "code": "+595", "national_code": "002" },
  { "name": "Peru", "code": "+51", "national_code": "00" },
  { "name": "Philippines", "code": "+63", "national_code": "00" },
  { "name": "Pitcairn", "code": "+870", "national_code": "00" },
  { "name": "Poland", "code": "+48", "national_code": "00" },
  { "name": "Portugal", "code": "+351", "national_code": "00" },
  { "name": "Puerto Rico", "code": "+1", "national_code": "787, or 939" },
  { "name": "Qatar", "code": "+974", "national_code": "00" },
  { "name": "Réunion and Mayotte", "code": "+262", "national _code": "00" },
  { "name": "Romania", "code": "+40", "national_code": "00" },
  { "name": "Russian Federation", "code": "+7", "national_code": "810" },
  { "name": "Rwanda", "code": "+250", "national_code": "00" },
  { "name": "Saint Helena and also Tristan Da Cunha", "code": "+290", "national_code": "00" },
  { "name": "Saint Kitts and Nevis", "code": "+1", "national_code": "869" },
  { "name": "Saint Lucia", "code": "+1", "national_code": "758" },
  { "name": "Saint Pierre and Miquelon", "code": "+508", "national_code": "00" },
  { "name": "Saint Vincent and the Grenadines", "code": "+1", "national_code": "784" },
  { "name": "Samoa", "code": "+685", "national_code": "00" },
  { "name": "San Marino", "code": "+378", "national_code": "00" },
  { "name": "São Tomé and Principe", "code": "+239", "national_code": "00" },
  { "name": "Saudi Arabia", "code": "+966", "national_code": "00" },
  { "name": "Senegal", "code": "+221", "national_code": "00" },
  { "name": "Serbia", "code": "+381", "national_code": "99" },
  { "name": "Seychelles", "code": "+248", "national_code": "00" },
  { "name": "Sierra Leone", "code": "+232", "national_code": "00" },
  { "name": "Singapore", "code": "+65", "national_code": "001" },
  { "name": "Slovakia", "code": "+421", "national_code": "00" },
  { "name": "Slovenia", "code": "+386", "national_code": "00" },
  { "name": "Solomon Islands", "code": "+677", "national_code": "00" },
  { "name": "Somalia", "code": "+252", "national_code": "00" },
  { "name": "South Africa", "code": "+27", "national_code": "09" },
  { "name": "Spain", "code": "+34", "national_code": "00" },
  { "name": "Sri Lanka", "code": "+94", "national_code": "00" },
  { "name": "Sudan", "code": "+249", "national_code": "00" },
  { "name": "Suriname", "code": "+597", "national_code": "00" },
  { "name": "Svalbard and Jan Mayen Islands", "code": "+47", "national_code": "00" },
  { "name": "Swaziland", "code": "+268", "national_code": "00" },
  { "name": "Sweden", "code": "+46", "national_code": "00" },
  { "name": "Switzerland", "code": "+41", "national_code": "00" },
  { "name": "Syrian Arab Republic (Syria)", "code": "+963", "national_code": "00" },
  { "name": "Taiwan, Republic of China", "code": "+886", "national_code": "002" },
  { "name": "Tajikistan", "code": "+992", "national_code": "810" },
  { "name": "Tanzania, United Republic of", "code": "+255", "national_code": "000" },
  { "name": "Thailand", "code": "+66", "national_code": "001" },
  { "name": "Timor-Leste", "code": "+670", "national_code": "None" },
  { "name": "Togo", "code": "+228", "national_code": "00" },
  { "name": "Tokelau", "code": "+690", "national_code": "00" },
  { "name": "Tonga", "code": "+676", "national_code": "00" },
  { "name": "Trinidad and Tobago", "code": "+1", "national_code": "868" },
  { "name": "Tunisia", "code": "+216", "national_code": "00" },
  { "name": "Turkey", "code": "+90", "national_code": "00" },
{ "name": "Turkmenistan", "code": "+993", "national_code": "810" },
  { "name": "Turks and Caicos Islands", "code": "+1", "national_code": "649" },
  { "name": "Tuvalu", "code": "+688", "national_code": "00" },
  { "name": "Uganda", "code": "+256", "national_code": "000" },
  { "name": "Ukraine", "code": "+380", "national_code": "810" },
  { "name": "United Arab Emirates", "code": "+971", "national_code": "00" },
  { "name": "United Kingdom", "code": "+44", "national_code": "00" },
  { "name": "United States of America", "code": "+1", "national_code": "011" },
  { "name": "Uruguay", "code": "+598", "national_code": "00" },
  { "name": "Uzbekistan", "code": "+998", "national_code": "810" },
  { "name": "Vanuatu", "code": "+678", "national_code": "00" },
  { "name": "Venezuela (Bolivarian Republic of)", "code": "+58", "national_code": "00" },
  { "name": "Viet Nam", "code": "+84", "national_code": "00" },
  { "name": "Virgin Islands, British", "code": "+1", "national_code": "284" },
  { "name": "Virgin Islands, US", "code": "+1", "national_code": "340" },
  { "name": "Wallis and Futuna Islands", "code": "+681", "national_code": "19" },
  { "name": "Yemen", "code": "+967", "national_code": "00" },
  { "name": "Zambia", "code": "+260", "national_code": "00" },
  { "name": "Zimbabwe", "code": "+263", "national_code": "00" }
]

const RegisterScreen = () => {
  const[name, setName] = useState('')
  const[email, setEmail] = useState('')
  const [phone, setPhone ] = useState(0)
  const [countryCode, setCountryCode] = useState(countryCodes[0].code);
  const[password, setPassword] = useState('')
  const[confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [error, setError] = useState('');

      

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);


    }
  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword((prev) => !prev);


    }
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, {isLoading }] = useRegisterMutation(); 

  const {userInfo } = useSelector((state) => state.auth )

  const { search } = useLocation();
  const sp = new URLSearchParams(search)
  const redirect  = sp.get('redirect') || '/'

    useEffect(() => {
      if(userInfo){ 
        navigate(redirect)}
    }, [userInfo, redirect, navigate])

    const submitHandler = async (e) => {
      e.preventDefault();
      
      // Check if passwords match
      if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
      }
  
      // Check if terms and conditions are agreed to
      if (!isAgreed) {
          setError('You must agree to the terms and conditions.');
          return; // Prevent registration
      } else {
          setError(''); // Clear error if agreed
      }
  
      // Proceed with registration
      try {
          const res = await register({ name, email, phone, password }).unwrap();
          dispatch(setCredentials({ ...res }));
          navigate(redirect);
      } catch (error) {
          if (error.data.errors) {
              error.data.errors.forEach(err => { toast.error(err.msg) });
          } else {
              toast.error('Invalid credentials');
          }
      }
  };
  


  return (
    <FormContainer style={{color:"black"}}>
        <h1>Sign Up</h1>

        <Form onSubmit={submitHandler}>
        <Form.Group controlId= 'name' className="my-3 ">
            <Form.Label> Name </Form.Label>
            <Form.Control
            type="text"
            className="black"
            placeholder="Enter name"
            value = {name}
            onChange = {(e) => setName(e.target.value)}
            >
            </Form.Control>
            </Form.Group>
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

            <Form.Group controlId='phone' className="my-3 ">
                    <Form.Label>Phone Number</Form.Label>
                    <div className="d-flex">
                        <Form.Select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            style={{ width: '150px', marginRight: '10px' }}
                        >
                            {countryCodes.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name} ({country.code})
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control
                            type="tel"
                            placeholder="Enter Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
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
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} {/* Using react-icons */}
          </Button>
        </div>
        <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={() => setIsAgreed(!isAgreed)}
                    />
                    I agree to the terms and conditions. <Link to ='/terms&condition'>Terms and conditions is written here</Link>
                </label>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Form.Group> 
            <Button type="submit" variant='primary' className="mt-2" disabled ={isLoading}>
                Register
            </Button>
              {isLoading && <Loader />}
        </Form>

        <Row className="py-3">
            <Col>
            Alread have an account ?  <Link to={ redirect ? `/login?redirect=${redirect}`: '/login'}>
              Login
            </Link>
            </Col>
        </Row>

    </FormContainer>
  )
}

export default RegisterScreen