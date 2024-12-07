const db = require("../config/db");

 // Step 1: Generate the next ID
// Function to generate the next ID based on store name
const generateNextId = async (store_name) => {
  // Get the first two letters of the store_name
  const prefix = store_name.substring(0, 2).toLowerCase(); // Ensure it’s in lowercase

  // Query to get the maximum sale_id from the sales table
  const query = "SELECT sale_id FROM sales";
  const [results] = await db.query(query);

  // If there are no sales in the database, return the first ID for the user
  if (results.length === 0) {
    return `${prefix}0001`;
  }

  // Convert sale_id to string and extract the_numeric_part
  const ids = results.map(sale => parseInt(sale.sale_id.slice(2))); // Skip the first 2 characters (prefix)

  // Get the maximum ID
  const maxId = Math.max(...ids);

  // Generate the next ID by incrementing the maxId and padding it to 4 digits
  return `${prefix}${(maxId + 1).toString().padStart(4, "0")}`;
};


// Function to get store name by user ID
const getStoreNameByUser = async (user_id) => {
  const sql = `
    SELECT store_name 
    FROM stores
    INNER JOIN users ON users.store_id = stores.store_id
    WHERE users.user_id = ?;
  `;
  
  const [rows] = await db.query(sql, [user_id]);
  
  if (rows.length === 0) {
    throw new Error(`Store not found for user ID: ${user_id}`);
  }

  return rows[0].store_name;
};

// Function to make a sale
const makesale = async (req, res) => {
  try {
    const { cashier_id, sales_person, total_amount, products, user } = req.body;

    // Retrieve store_name based on user (user_id)
    const store_name = await getStoreNameByUser(user);
    console.log(`Store name for user ${user}: ${store_name}`);

    const sales_id = await generateNextId(store_name); // Pass store_name

    if (!sales_id) {
      return res.status(500).json({ message: "Failed to generate sales ID." });
    }

    const salesQuery = `
      INSERT INTO sales (sale_id, cashier_id, sales_person, total_amount)
      VALUES (?, ?, ?, ?);
    `;

    await db.query(salesQuery, [sales_id, cashier_id, sales_person, total_amount]);
    console.log(sales_id);
    
    const salesItemQuery = `
      INSERT INTO sales_items (sale_id, product_id, item_quantity, item_price, imei_number, discount)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const updateProductStockQuery = `
      UPDATE products
      SET product_stock = product_stock - ?
      WHERE product_id = ? AND product_stock >= ?;
    `;

    // Query for updating the stock table
    const updateStockQuery = `
      UPDATE stock
      SET stock_quantity = stock_quantity - ?
      WHERE store_name = ? AND product_id = ? AND stock_quantity >= ?;
    `;

    // Loop through each product to process the sale
    for (const product of products) {
      const { product_id, quantity, price, serial_number, discount } = product;
      const imei_number = serial_number;
      const item_quantity = quantity;
      const item_price = price;

      try {
        // Insert into sales_items table (null if no imei_number)
        await db.query(salesItemQuery, [
          sales_id,
          product_id,
          item_quantity,
          item_price,
          imei_number || null, // Handle cases where imei_number may be null
          discount
        ]);

        // Update product stock
        const [productStockUpdated] = await db.query(updateProductStockQuery, [item_quantity, product_id, item_quantity]);

        if (productStockUpdated.affectedRows === 0) {
          throw new Error(`Insufficient product stock for product ${product_id}.`);
        }

        // If an IMEI number is provided, update the IMEI-related data
        if (imei_number) {
          // Fetch current IMEI numbers from the products table
          const [currentImeiResult] = await db.query("SELECT imei_number FROM products WHERE product_id = ?", [product_id]);
          const currentImeiNumbers = currentImeiResult[0]?.imei_number.split(",") || [];

          // Remove the sold IMEI number from the list
          const updatedImeiNumbers = currentImeiNumbers.filter(imei => imei !== imei_number).join(",");

          // Update IMEI in the products table
          const updateProductImeiQuery = `
            UPDATE products
            SET imei_number = ?
            WHERE product_id = ?;
          `;
          await db.query(updateProductImeiQuery, [updatedImeiNumbers, product_id]);

          // Fetch current IMEI numbers from the stock table
          const [currentStockImeiResult] = await db.query("SELECT imei_numbers FROM stock WHERE store_name = ? AND product_id = ?", [store_name, product_id]);
          const currentStockImeiNumbers = currentStockImeiResult[0]?.imei_numbers.split(",") || [];

          // Remove the sold IMEI number from stock's IMEI list
          const updatedStockImeiNumbers = currentStockImeiNumbers.filter(imei => imei !== imei_number).join(",");

          // Update stock IMEI in the stock table
          const updateStockImeiQuery = `
            UPDATE stock
            SET imei_numbers = ?
            WHERE store_name = ? AND product_id = ?;
          `;
          await db.query(updateStockImeiQuery, [updatedStockImeiNumbers, store_name, product_id]);
        }

        // Update the stock table for quantity only (for all products, whether IMEI exists or not)
        const [stockUpdated] = await db.query(updateStockQuery, [item_quantity, store_name, product_id, item_quantity]);

        if (stockUpdated.affectedRows === 0) {
          throw new Error(`Failed to update stock for product ${product_id} in store ${store_name}.`);
        }

      } catch (err) {
        console.error(`Error processing product ${product_id}:`, err.message);
        return res.status(500).json({ message: `Error processing product ${product_id}.`, err });
      }
    }

    return res.status(200).json({ message: "Sales and items added successfully.", sales_id });

  } catch (err) {
    console.error("Error processing sales and items:", err.message);
    return res.status(500).json({ message: "Error inside server during sales processing.", err });
  }
};






const getsales = async (req,res) => {
    console.log("Request body",req.body);


    const sql = "SELECT * FROM sales";
    
    try {
      console.log("get products");
      const [rows] = await db.query(sql);
      return res.json(rows);
    } catch (err) {
      console.error("Error fetching products:", err.message);
      return res.status(500).json({ message: "Error inside server", err });
    }

};

const getsalebyid = async (req, res) => {
  // Extract sale_id from the request parameters
  const { sale_id } = req.params;

  const sql = "SELECT * FROM sales WHERE sale_id = ?";

  try {
    console.log("Fetching sale with ID:", sale_id);
    const [rows] = await db.query(sql, [sale_id]);

    // Check if the sale was found
    if (rows.length === 0) {
      return res.status(404).json({ message: "Sale not found." });
    }

    // Return the found sale
    return res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching sale:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};


const getSalesItemsByDate = async (req, res) => {
  const { date } = req.query; // Get the date from request query parameters

  const sql = `
    SELECT
      sales_items.sale_item_id,
      sales_items.sale_id,
      sales_items.product_id,
      sales_items.item_quantity,
      sales_items.item_price,
      sales_items.imei_number,
      sales_items.discount,
      sales_items.warranty_period,
      sales.created_at AS sale_date,
      cashiers.cashier_name,
      stores.store_name
    FROM sales_items
    INNER JOIN sales ON sales.sale_id = sales_items.sale_id
    INNER JOIN cashiers ON sales.cashier_id = cashiers.cashier_id
    INNER JOIN stores ON cashiers.store_id = stores.store_id
    WHERE DATE(sales.created_at) = ?
    ORDER BY stores.store_name, sales_items.sale_item_id;
  `;

  try {
    // Execute the SQL query to get the sales items for the specified date
    const [rows] = await db.query(sql, [date]);

    // If no sales items are found for the date, return a 404 response
    if (rows.length === 0) {
      return res.status(404).json({ message: "No sales items found for the given date." });
    }

    // Return the sales items along with store and cashier details
    return res.status(200).json({ sales_items: rows });
  } catch (err) {
    console.error("Error fetching sales items by date:", err.message);
    return res.status(500).json({ message: "Error inside server during sales items fetch.", err });
  }
};






  

const getDailySalesReport = async (req, res) => {
  const { date } = req.query; // Date will be passed from the frontend in the format 'YYYY-MM-DD'

  const sql = `
    SELECT
      sales.sale_id,
      sales.sales_person,
      sales.total_amount,
      sales.created_at AS sale_date,
      cashiers.cashier_name,
      stores.store_name,
      stores.store_address,
      stores.store_phone_number,
      sales_items.product_id,
      sales_items.item_quantity,
      sales_items.item_price,
      sales_items.imei_number,
      sales_items.discount,
      products.product_name -- Include product name from the products table
    FROM sales_items
    INNER JOIN sales ON sales.sale_id = sales_items.sale_id
    INNER JOIN cashiers ON sales.cashier_id = cashiers.cashier_id
    INNER JOIN stores ON cashiers.store_id = stores.store_id
    INNER JOIN products ON products.product_id = sales_items.product_id -- Join with products table to get the product name
    WHERE DATE(sales.created_at) = ?
    ORDER BY stores.store_name, sales.sale_id;
  `;

  try {
    // Fetch the sales report based on the provided date
    const [rows] = await db.query(sql, [date]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No sales found for the given date." });
    }

    // Group the results by store name
    const salesReportByStore = {};
    
    rows.forEach(sale => {
      const storeName = sale.store_name;

      // If the store doesn't exist in the report, initialize it
      if (!salesReportByStore[storeName]) {
        salesReportByStore[storeName] = {
          store_name: storeName,
          store_address: sale.store_address,
          store_phone_number: sale.store_phone_number,
          total_sales: 0,
          sales: []
        };
      }

      // Add this sale's total amount to the store's total sales
      salesReportByStore[storeName].total_sales += parseFloat(sale.total_amount);

      // Add the sale item details to the store's sales list
      salesReportByStore[storeName].sales.push({
        sale_id: sale.sale_id,
        sales_person: sale.sales_person,
        total_amount: sale.total_amount,
        sale_date: sale.sale_date,
        cashier_name: sale.cashier_name,
        product_id: sale.product_id,
        product_name: sale.product_name, // Include product name
        item_quantity: sale.item_quantity,
        item_price: sale.item_price,
        imei_number: sale.imei_number,
        discount: sale.discount
      });
    });

    // Convert the report object to an array for easier handling on the frontend
    const reportArray = Object.values(salesReportByStore);

    return res.status(200).json({
      message: "Daily sales report generated successfully.",
      report: reportArray
    });
  } catch (err) {
    console.error("Error generating daily sales report:", err.message);
    return res.status(500).json({
      message: "Error inside server during daily sales report generation.",
      err
    });
  }
};


  
module.exports = {
    makesale,
    getsales,
    getsalebyid,
    getDailySalesReport,
    getSalesItemsByDate

  };