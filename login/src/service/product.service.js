const ProductModel = require('../model/product.model');
module.exports = class productServices{
    
    // Add new product
    async addNewProduct(body) {
        try {
            return await ProductModel.create(body);
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    // Get all product
    async getAllProducts(body) {
        try {
            let categoryWise = query.category && query.category !== "" ? [
                {$match: {category: query.category}}
            ]: [];
            let find = [
                {$match: { isDelete: false}},
                ...categoryWise,
                {
                    $project: {
                        title:1,
                        price:1,
                        productImage: 1
                    }
                }
            ]

            let result = await Product.aggregate(find);
            return result
        } catch (error) {
            console.log(error);
            return error.message;
        }
    }

    // Get one product
    async getProduct(body) {
        try {
            return await ProductModel.findOne(body);
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    // Get Product By Id
    async getProductById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            console.log(error);
            return error;
        }
    };

    // Update Product
    async updateProduct(id, body) {
        try {
            return await ProductModel.findByIdAndUpdate(id, { $set: body}, { new: true});
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}