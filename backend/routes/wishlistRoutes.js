import express from "express";
import { getWishListCount, addToWishlist } from "../controllers/wishlistController.js"

const wishlistRouter = express.Router();

wishlistRouter.get("/count", getWishListCount);
wishlistRouter.put("/count/:id", addToWishlist)

export default wishlistRouter;