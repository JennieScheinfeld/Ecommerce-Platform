import { useState } from "react";
import '../styles/searchBar.css'
import '../styles/buttons.css'
function SearchBar ({updateSellerName}) {
    const [sellerName, setSellerName] = useState("")
    const handleClick = (e) => {
        updateSellerName(sellerName);
        setSellerName("")
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setSellerName(value)
    }
    return <div className="searchContainer">
    Seller Name:
        <input  style={{margin: "10px"}} type="text" value={sellerName} onChange={handleChange}></input>
        <button className="button" onClick={handleClick}> Change Seller</button>

    </div>
}


export default SearchBar;