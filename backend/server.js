import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js"
import {sql} from "./config/db.js"
import { aj } from "./lib/arcjet.js"
import path from "path";
import wishlistRouter from "./routes/wishlistRoutes.js"

const __dirname = path.resolve();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], 
      connectSrc: ["'self'"], // <--- This fixes your specific error
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], // Allow Bootstrap JS
      styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"], // Allow Bootstrap CSS
      imgSrc: ["'self'", "data:", "https://images.unsplash.com",],
    },
  })
);              // helmet is a security middleware that helps you protect your app by setting various HTTP headers (USE ALWAYS)
app.use(morgan("dev"));             // Will log the requests to the console
app.use(express.json());
app.use(cors());

// apply arcjet rate limit to all routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1                               // Specifies that each request consumes 1 token
        })

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                res.status(429).json({error: "Too many requests"});
            } else if (decision.reason.isBot) {
                res.status(403).json({error: "Bot access denied"});
            } else {
                res.status(403).json({error: "Forbidden"});
            }
            return;
        }

        // check for spoofed bots
        if(decision.reason?.isBot?.() && decision.reason?.isSpoofed?.()) {
            res.status(403).json({ error: "Spoofed bot detected" });
            return;
        }

        next();
    } catch (err) {
        console.log("Arcjet error: " + err);
        next(err);
    }
})

app.use("/api/products", productRoutes)
app.use("/wishlist", wishlistRouter)


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                wishlist BOOLEAN NOT NULL DEFAULT false
            );
        `; // Use TIMESTAMP instead of DATETIME and CURRENT_TIMESTAMP instead of NOW() - This allows for time zone change automatically
        console.log("Database Initialized Successfully")
    } catch (err) {
        console.log("DB INIT ERR: " + err)
    }
}

initDB().then (() => {
        app.listen(PORT, () => {
        console.log("Server is running on Port " + PORT);
    })
})