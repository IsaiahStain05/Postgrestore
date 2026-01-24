import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:3000"

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,
    formData: {
        name: "",
        price: "",
        image: "",
    },

    setFormData: (formData) => set({formData}),
    resetForm: () => set({formData: {name: "", price: "", image: ""}}),

    fetchProducts: async () => {
        set({loading: true});
        try{
            const response = await axios.get(`${BASE_URL}/api/products`);
            set({products: response.data.data, error: null});
        } catch (err) {
            if(err.status === 429){
                set({error: "Too many requests", products: []});
            } else {
                set({error: err, products: []});
            }
        } finally {
            set({loading: false});
        }
    },

    deleteProduct: async (id) => {
        set({loading: true});
        try{
            const response = await axios.delete(`${BASE_URL}/api/products/${id}`);
            set(prev => ({products: prev.producs.filter(product => product.id !== id)}));
            toast.success("Product deleted successfully!");
        } catch (err) {
            if(err.status === 429) {
                set({error: "Too many requests", products: []});
            } else {
                toast.error("Something went wrong deleting the product!");
                set({error: err, products: []});
            }
        } finally {
            set({loading: false});
        }
    },

    addProduct: async (e) => {
        e.preventDefault();
        set({loading: true});
        try {
            const {formData} = get()
            await axios.post(`${BASE_URL}/api/products`, formData);
            await get().fetchProducts();
            get().resetForm();
            // close the model
            toast.success("Product added successfully!");
        } catch (err) {
            toast.error("Something went wrong adding your product!");
        } finally {
            set({loading: false})
        }
    }

}));