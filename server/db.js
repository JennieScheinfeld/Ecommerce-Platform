const sqlite3 = require('sqlite3').verbose();
const DB_PATH = './seller_products.db';

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
    createTable(); // Create the table if it doesn't exist
  }
});

// Create table if it doesn't exist
function createTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS seller_products (
      ASIN TEXT,
      Locale TEXT,
      Seller_name TEXT,
      Availability INTEGER,
      Price REAL,
      Product_name TEXT,
      Product_link TEXT,
      PRIMARY KEY (ASIN, Locale)
    )
  `);
}

// Create a seller product
function createSellerProduct(sellerProduct, callback) {
  db.run(`
    INSERT INTO seller_products (ASIN, Locale, Seller_name, Availability, Price, Product_name, Product_link)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    sellerProduct.ASIN,
    sellerProduct.Locale,
    sellerProduct.Seller_name,
    sellerProduct.Availability,
    sellerProduct.Price,
    sellerProduct.Product_name,
    sellerProduct.Product_link,
  ], callback);
}

// Retrieve a seller product by ASIN and Locale
function getSellerProduct(asin, locale, callback) {
  db.get(`
    SELECT * FROM seller_products WHERE ASIN = ? AND Locale = ?
  `, [asin, locale], callback);
}

// Update a seller product by ASIN and Locale
function updateSellerProduct(asin, locale, updatedData, callback) {
  db.run(`
    UPDATE seller_products
    SET Seller_name = ?,
        Availability = ?,
        Price = ?,
        Product_name = ?,
        Product_link = ?
    WHERE ASIN = ? AND Locale = ?
  `, [
    updatedData.Seller_name,
    updatedData.Availability,
    updatedData.Price,
    updatedData.Product_name,
    updatedData.Product_link,
    asin,
    locale,
  ], callback);
}

// Delete seller products by an array of ASIN and Locale pairs
function deleteSellerProducts(products, callback) {
  const placeholders = products.map(() => '(?, ?)').join(', ');
  const values = products.flatMap((product) => [product.ASIN, product.Locale]);

  db.run(`
    DELETE FROM seller_products
    WHERE (ASIN, Locale) IN (${placeholders})
  `, values, callback);
}

// Retrieve all seller products by seller name
function getSellerProductsBySeller(sellerName, callback) {
  db.all(`
    SELECT * FROM seller_products WHERE Seller_name = ?
  `, [sellerName], callback);
}

module.exports = {
  createSellerProduct,
  getSellerProduct,
  updateSellerProduct,
  deleteSellerProducts,
  getSellerProductsBySeller,
};
