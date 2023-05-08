const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');


const app = express();
const PORT = 4000;

// Set up middleware and body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const checkUniqueness = (req, res, next) => {
  const asin = req.body.ASIN;
  const locale = req.body.Locale;

  db.getSellerProduct(asin, locale, (err, row) => {
      if (row) {
        res.status(409).json({ error: 'Seller product already exists. Need Unique ASIN and Locale.' });
      } else {
        next();
      }
  })
}

// Create operation
app.post('/seller_products', checkUniqueness, (req, res) => {

  const sellerProduct = req.body;
  console.log('craete witht htse deets:', sellerProduct)

  db.createSellerProduct(sellerProduct, (err) => {
    if (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error creating seller product.' });
    } else {
    res.status(201).json({ message: 'Seller product created successfully.' });
    }
  });
});


// Read operation
app.get('/seller_products', (req, res) => {
    const asin = req.query.ASIN;
    const locale = req.query.Locale;
  
    db.getSellerProduct(asin, locale, (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error retrieving seller product.' });
      } else {
        if (row) {
          res.json(row);
        } else {
          res.status(404).json({ error: 'Seller product not found.' });
        }
      }
    });
  });


// ReadBySeller operation
app.get('/seller_products/by_seller', (req, res) => {
    const sellerName = req.query.seller_name;
    let adjustedName = sellerName.toLowerCase();
    console.log("adjustedName:", adjustedName)
  
    db.getSellerProductsBySeller(adjustedName, (err, rows) => {
      console.log("rows pulled:", rows)
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error retrieving seller products.' });
      } else {
        console.log("success!")
        res.json(rows);
      }
    });
  });


// Update operation
app.put('/seller_products/:asin/:locale', (req, res) => {
    const asin = req.params.asin;
    const locale = req.params.locale;
    const updatedData = req.body;
  
    db.updateSellerProduct(asin, locale, updatedData, (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error updating seller product.' });
      } else {
        res.json({ message: 'Seller product updated successfully.' });
      }
    });
  });


// Delete operation
app.delete('/seller_products', (req, res) => {
    const products = req.body.products
 
    db.deleteSellerProducts(products, (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error deleting seller products.' });
      } else {
        console.log("success!")
        res.json({ message: 'Seller products deleted successfully.' });
      }
    });
  });


// Start server 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });