import { EditIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";


function ProductCard({product}) {
  const handleDelete = async () => {
    const navigate
    if(window.confirm("Are you sure you want to delete this product?")){
      await deleteProduct(id);
      navigate("/");
    }
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
