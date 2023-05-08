import { useState } from "react";
import MyForm from "./components/Form";
import ProductList from "./components/ProductTable"
import SearchBar from "./components/SearchBar"
import './styles/app.css'

function App() {
  const [sellerName, setSellerName] = useState('')
  const [products, setProducts] = useState([ {Price: "20"}])

  const updateProductList = (sellerName) => {

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
    
  }

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

  const onDeletion = (ASIN, Locale) => {
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
    <div className="container">
      <SearchBar updateSellerName={updateProductList}/>
      <div className="gridContainer">
        <MyForm />
        <ProductList products={products} onDeletion={onDeletion}/>
      </div>

    </div>
  );
}

export default App;
