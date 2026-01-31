import { ShoppingBagIcon } from "lucide-react";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : ""

function WishlistIndicator({wishlistCount}) {
    return (
        <span className="badge badge-sm badge-primary indicator-item">
            {wishlistCount}
        </span>
    )
    
}

export function WishlistButton ({wishlistCount}) {
    return (
        <button className="btn btn-ghost btn-circle indicator size-12 relative">
            <ShoppingBagIcon className="size-5" />
            <WishlistIndicator wishlistCount={wishlistCount}/>
        </button>
    )
}
