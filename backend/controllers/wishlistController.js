import { sql } from "../config/db.js";

export const getWishListCount = async (req, res) => {
    try {
        const result = await sql`
            SELECT COUNT(DISTINCT(id))::int AS count FROM products WHERE wishlist=true;
        `;
        res.status(200).json({ success: true, count: result[0].count})
    } catch (err) {
        res.status(500).json({success: false, error: err})
    }
};

export const addToWishlist = async (req, res) => {
    const id = Number(req.params.id)
    try {
        const updatedWishlist = await sql`
            UPDATE products SET wishlist = true WHERE id = ${id} AND wishlist = false RETURNING *
        `;

        if (updatedWishlist.length === 0) {
            return res.status(404).json({error: "Product not found or already wishlisted."})
        }

        console.log("success")
        res.status(200).json({success: true, data: updatedWishlist[0]})
    } catch (err) {
        res.status(500).json({success: false, error: err})
    }
}