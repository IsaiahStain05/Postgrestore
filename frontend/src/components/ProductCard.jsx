import { EditIcon, Trash2Icon, ShoppingBagIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore.js";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : ""


function ProductCard({product, setWishlistCount}) {
  const { deleteProduct, fetchProducts } = useProductStore();
  const navigate = useNavigate();
  const handleDelete = async () => {
    if(window.confirm("Are you sure you want to delete this product?")){
      await deleteProduct(product.id);
      await fetchProducts();
      navigate("/");
    }
  }
  const handleAdd = async () => {
    await axios.put(`${BASE_URL}/wishlist/count/${product.id}`)
    setWishlistCount(prev => prev + 1)
  }
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="relative pt-[56.25%] overflow-hidden rounded-t-xl">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      </div>

      <div className="card-body">
        <h2 className="card-title text-lg font-semibold">{product.name}</h2>
        <p className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>

        <div className="card-actions justify-end mt-4">
            <button className="btn btn-sm btn-success btn-outline text-center" onClick={handleAdd}>    {/* Add onClick={addProductToCart} */}
              <ShoppingBagIcon className="size-4"/>
            </button>
            <Link to={`/product/${product.id}`} className="btn btn-sm btn-info btn-outline">
                <EditIcon className="size-4" />
            </Link>
            <button className="btn btn-sm btn-error btn-outline" onClick={handleDelete}>
                <Trash2Icon className="size-4" />
            </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard;
