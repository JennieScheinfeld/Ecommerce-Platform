import { useState, useEffect } from 'react'
import '../styles/productTable.css'
import '../styles/buttons.css'



function ProductList({ refresh, sellerName }) {
    const [products, setProducts] = useState([])

    useEffect(() => {
      fetch(`http://localhost:4000/seller_products/by_seller/?seller_name=${sellerName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          return response.json()
        })
        .then(data => {
          console.log("data:", data)
          setProducts(data)
        })
        .catch(err => {
          console.log(err)
        })
    }, [sellerName])
  
    const deleteFromDB = (ASIN, Locale) => {
      fetch(`http://localhost:4000/seller_products`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          products: [
            { ASIN, Locale}
          ]
        })
      })
    }
  
    const handleClick = (ASIN, Locale) => {
      try {
        deleteFromDB(ASIN, Locale)
        const tempList = [...products]
        const updatedList = tempList.filter(product => product.ASIN !== ASIN || product.Locale !== Locale)
        setProducts(updatedList)
      } catch(err) {
        console.log("error deleting:", {ASIN, Locale})
      }
    }
  


    return (
      <table className="listContainer">
        <thead>
          <tr>
            <th>ASIN</th>
            <th>Seller Name</th>
            <th>Locale</th>
            <th>Price</th>
            <th>Product Name</th>
            <th>Product Link</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
            {products.map(product => {
            return <tr key={product.ASIN+product.Locale} className="item">
                    <td>{product.ASIN}</td>
                    <td>{product.Seller_name}</td>
                    <td>{product.Locale}</td>
                    <td>{product.Price}$</td>
                    <td>{product.Product_name}</td>
                    <td>{product.Product_link}</td>
                    <td>
                      <button className='button' style= {{width: "50px"}} onClick={() => handleClick(product.ASIN, product.Locale)}>Delete</button>                 
                    </td>
                </tr>
        })}
        </tbody>
      </table>
    );
  };


export default ProductList;