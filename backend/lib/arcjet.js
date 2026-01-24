import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import dotenv from "dotenv";

dotenv.config();

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // shield protects your app from common attacks
        shield({mode:"LIVE"}),
        detectBot({
            // Block all bots except search engines
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE"
                // see the full list at https://arcjet.com/bot-list
            ]
        }),
        // rate limiting - also search sliding window algorithm

        tokenBucket({
            mode:"LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10
        })
    ]
})