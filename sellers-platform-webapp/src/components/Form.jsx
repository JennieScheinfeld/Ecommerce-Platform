import React, { useState } from 'react';
import '../styles/form.css'


function MyForm() {
  const [formData, setFormData] = useState({
    ASIN: '',
    Locale: '',
    Seller_name: '',
    Availability: false,
    Price: '',
    Product_name: '',
    Product_link: ''
  });
  const [error, setError] = useState(null)
  const [submited, setSubmited] = useState(false)

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? e.target.checked : value;
    setFormData({ ...formData, [name]: fieldValue });
  };

  const validInput = () => {
    let valid = true
    Object.keys(formData).forEach(key => {
      if (formData[key] === "") {
        setError("No fields can be left empty")
        valid = false
      }
    })

    if (formData.Price < 0) {
      setError("Price cannot be a negative number")
        valid = false
    }
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = validInput()
    if (!valid) {
      return
    }
    setError(null)

    fetch('http://localhost:4000/seller_products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then((response) => response.json())
    .then((data) => {
    console.log('Response from server:', data);
    if (data.error) {
      setError(data.error)
    }
    setFormData({
        ASIN: '',
        Locale: '',
        Seller_name: '',
        Availability: false,
        Price: '',
        Product_name: '',
        Product_link: ''
    });
    setSubmited(true)
    setTimeout(() => {
      setSubmited(false)
    }, 2000)
    })
    .catch((error) => {
    console.error('Error:', error);
    });
};

  return (
    <div  className='formContainer'>
      {error ? <div id="errorMsg">{error}</div>: null}
      <form onSubmit={handleSubmit}>
      <label>
        ASIN
        <input
          type="text"
          name="ASIN"
          value={formData.ASIN}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Locale
        <input
          type="text"
          name="Locale"
          value={formData.Locale}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Seller Name
        <input
          type="text"
          name="Seller_name"
          value={formData.Seller_name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Price
        <input
          type="number"
          name="Price"
          value={formData.Price}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Product Name
        <input
          type="text"
          name="Product_name"
          value={formData.Product_name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Product Link
        <input
          type="text"
          name="Product_link"
          value={formData.Product_link}
          onChange={handleChange}
        />
      </label>
      <br />
      {!submited ? <button className="button" type="submit">Add Product</button> : <div style={{ color: "pink"}}>Submited!</div>}
    </form>
    </div>

  );
}

export default MyForm;
