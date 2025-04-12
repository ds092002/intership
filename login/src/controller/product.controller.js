const ProductServices = require('../service/product.service');
const productServices = new ProductServices();

exports.addNewProduct = async (req, res) => {
    try {
        console.log("Body===>", req.body);
        let product = await productServices.getProduct({name: req.body.name, isDelete: false});
        if (product) {
            res.status(400).json({message: 'Product is already exist...'});
        }
        product = await productServices.addNewProduct({...req.body});
        res.status(201).json({product, message: `Product has been added successfully..`});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: `Internal Server Error..${console.error()}`});
    }
};

exports.updateProduct = async (req, res) => {
    try {
        let product = await productServices.getProductById(req.query.productId);
        if (!product) {
            res.status(404).json({message: `Product not found`});
        }
        product = await productServices.updateProduct(product?._id, { ...req.body });
        res.status(202).json({product, message: `Product has been updated successfully...`});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: `Internal Server Error..${console.error()}`});
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        let product = await productServices.getProductById(req.query.productId);
        if (!product) {
            res.status(404).json({message: `Product not found`});
        }
        product = await productServices.updateProduct(product._id,{isDelete: true});
        res.status(202).json({message: `Product has been deleted successfully`});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: `Internal Server Error..${console.error()}`});
    }
}