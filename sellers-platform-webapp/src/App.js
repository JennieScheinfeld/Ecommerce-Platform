import { useState } from "react";
import MyForm from "./components/Form";
import ProductList from "./components/ProductTable"
import SearchBar from "./components/SearchBar"
import './styles/app.css'

function App() {
  const [sellerName, setSellerName] = useState('')

  return (
    <div className="container">
      <SearchBar updateSellerName={setSellerName}/>
      <div className="gridContainer">
        <MyForm />
        <ProductList sellerName={sellerName} />
      </div>

    </div>
  );
}

export default App;
