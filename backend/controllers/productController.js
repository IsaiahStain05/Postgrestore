import { sql } from '../config/db.js'


export const getProducts = async (req, res) => {
    try{
        const products = await sql`
            SELECT * FROM products ORDER BY created_at DESC
        `;
        res.status(200).json({ success: true, data: products });
    } catch (err) {
        console.log("Error getting products: " + err);
        res.status(500).json({success: false, error: err})
    }
};

export const getProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await sql `SELECT * FROM products WHERE id = ${id}`;
        res.status(200).json({success: true, data: product[0]})
    } catch (err) {
        console.log("Error getting single product: " + err);
        res.status(500).json({success: false, error: err})
    }
};

export const createProduct = async (req, res) => {
    const {name, price, image} = req.body;
    
    if(!name || !price || !image){
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    try{
        const newProduct = await sql`
            INSERT INTO products (name, price, image) VALUES (${name}, ${price}, ${image}) RETURNING *
        `;
        res.status(201).json({success: true, data: newProduct[0]})
    } catch (err) {
        console.log("Error creating product: " + err);
        res.status(500).json({success: false, error: err});
    }
};

export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { name, price, image } = req.body;
    try {
        const updatedProduct = await sql`UPDATE products SET name=${name}, price=${price}, image=${image} WHERE id=${id} RETURNING *`;

        if(updatedProduct.length === 0) {
            return res.status(404).json({success: false, message: "Product not found"})
        }

        res.status(200).json({success: true, data: updatedProduct[0]})
    } catch (err) {
        console.log("Error updating product: " + err);
        res.status(500).json({success: false, error: err})
    }
};

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedProduct = await sql `DELETE FROM products WHERE id=${id} RETURNING *`;
        if (deletedProduct.length === 0) {
            return res.status(404).json({success: false, message: "Item ID not found."})
        }

        res.status(200).json({success: true, data: deletedProduct[0]})
    } catch (err) {
        console.log("Error in deleteProduct: " + err)
        res.status(500).json({success: false, error: err})
    }
};
