const Product = require('../models/productModel');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const createProduct = async (req, res) => {
    try {
      const { name, weight,imageUrl,description,metal} = req.body;
  
      // Create a new product instance
      const newProduct = await Product.create({
        name,
        weight,
        imageUrl,
        description,
        metal

    });
  
      // Save the product to the database
    
  
      res.status(201).json({
        sucess : true,
        data : newProduct,
        message : "successfull entry"
      }); // Respond with the newly created product
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getConversionRate = async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD'); // Replace with actual API endpoint
      const conversionRate = response.data.rates.INR;
      return conversionRate;
    } catch (error) {
      console.error('Error fetching conversion rate:', error.message);
      throw error;
    }
  };

const getPrice = async (type, weight) => {
  let apiUrl;
  if (type === 'gold') {
    apiUrl = process.env.GOLD_PRICE_API_URL;
  } else if (type === 'silver') {
    apiUrl = process.env.SILVER_PRICE_API_URL;
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'x-access-token': process.env.GOLD_API_KEY,
      },
    });
    // console.log("Response: ",response);

    const pricePerOunce = response.data.price; // Assuming the API response has a `price` field
    console.log("PRICE PER OUNCE: ",pricePerOunce)
    const pricePerGramInUSD = pricePerOunce / 31.1; // Convert price per ounce to price per gram
    console.log("PRICE PER GRAM IN USD: ",pricePerGramInUSD)

    const conversionRate = await getConversionRate();

    const pricePerGramInINR = pricePerGramInUSD * conversionRate
    console.log("INDIAN: ",pricePerGramInINR)
    return pricePerGramInINR * weight;
  } catch (error) {
    throw new Error('Error fetching price: ' + error.message);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    // console.log(products);
    const productsWithPrices = await Promise.all(
      products.map(async (product) => {
        const price = await getPrice(product.metal, product.weight);
        return { ...product._doc, price };
      
        
      })
    );
    res.json(productsWithPrices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProducts , createProduct};
