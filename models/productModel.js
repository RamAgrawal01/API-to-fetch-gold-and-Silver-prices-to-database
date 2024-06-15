const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
   
    weight:{
        type:Number,
        required:true,

    },
    imageUrl:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,

    },
    metal:{
        type:String,
        enum:["gold" , "silver"]
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
