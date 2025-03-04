import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const FilterSidebar = () => {
    const navigate = useNavigate();
    const { category: urlCategory, brand: urlBrand, keyword:urlKeyword } = useParams();
    
    const [category, setCategory] = useState(urlCategory || '');
    const [brand, setBrand] = useState(urlBrand || '');
    const [keyword, setKeyword] = useState(urlKeyword || '');

    
    // Mapping of categories to brands
    

    // State for available brands based on selected category
    const [availableBrands, setAvailableBrands] = useState([]);

    // Update available brands when category changes
    useEffect(() => {
      const categoryBrandMap = {
        ladies: [
            "ladies dresses",
            "ladies tops",
            "ladies set",
            "ladies accessories",
            "ladies shorts",
            "ladies pants skirts",

        ],
        men: [
            "men pants",
            "men tops",
            "men set",
            "men accessories",
            "men shorts",
            "men jackets",
        ],
        kemBag: [
            "leather bag",
        ],
        
    };
    
        if (category) {
            setAvailableBrands(categoryBrandMap[category] || []);
            setBrand(''); // Reset brand when category changes
        } else {
            setAvailableBrands([]);
        }
    }, [category]);
    
    const colorSelect = {
          
          white:  "White",
          balck:  "Black",
          brown: "Brown",
          nude: "Nude",
          ivory:"Ivory"
           
        
    }

    const submitHandler = (e) => {
        e.preventDefault();

        // Construct the filter URL based on selected filters
        let filterUrl = '/products/filter';

        if (category) {
            filterUrl += `/${category.trim()}`;
            setCategory('')
        }
        if (brand) {
            filterUrl += `/${brand.trim()}`;
            setBrand('')
    
        }
        if (keyword) {
            navigate(`/products/search/${keyword.trim()}`);
            setKeyword('')
        } else {
            navigate(filterUrl);
        }
    };



    return (
        <div>
            <Form onSubmit={submitHandler} >
            <h2>Filter By Colors</h2>

            <Form.Group controlId="keyword">
                    <Form.Label>Color</Form.Label>
                    <Form.Control as='select'  value={keyword} onChange={(e) => setKeyword(e.target.value)} className='w-75 w-md-50' > 
                    <option value=""> Color</option>
                    { Object.values(colorSelect).map(( value) =>(
                        <option  value={value}>{value}</option>
                    ) )}
                    </Form.Control>
                </Form.Group>
                <Button type="submit" variant="outline-primary" className='my-3'>Apply</Button>

                <h2>Filter By Collections</h2>

                <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)} className='w-75 w-md-50'>
                        <option value="">All</option>
                        <option value="ladies">Women</option>
                        <option value="men">Men</option>
                        <option value="kemBag">Kem Bag</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="brand">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control as="select" value={brand} onChange={(e) => setBrand(e.target.value)} disabled={!category}className='w-75 w-md-50'>
                        <option value="">All</option>
                        {availableBrands.map((b, index) => (
                            <option key={index} value={b}>{b}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
               
                <Button type="submit" variant="outline-primary" className='my-3 '>Apply</Button>
            </Form>
        </div>
    );
};

export default FilterSidebar;

