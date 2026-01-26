import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// base url will be dynamic depending on the environment
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : ""


export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,
    currentProduct: null,
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
            await axios.delete(`${BASE_URL}/api/products/${id}`);
            toast.success("Product deleted successfully!");
        } catch (err) {
            const message =
            err.response?.data?.message ||
            err.message ||
            "Something went wrong deleting the product!";
            
            toast.error("Something went wrong deleting the product!");
            set({error: message});
            
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
            document.getElementById("addProductModal").close();
            toast.success("Product added successfully!");
        } catch (err) {
            toast.error("Something went wrong adding your product!");
        } finally {
            set({loading: false})
        }
    },

    fetchProduct: async (id) => {
        set({loading: true});
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            set({currentProduct: response.data.data, formData: response.data.data, error: null});
        } catch (err) {
            set({error: err, currentProduct: null});
        } finally {
            set({loading: false});
        }
    },
    updateProduct: async (id) => {
        set({loading: true});
        try {
            const {formData} = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
            set({currentProduct: response.data.data});
            toast.success("Successfully updated product!");
        } catch (err) {
            toast.error("Something went wrong updating your product!")
        } finally {
            set({loading: false})
        }
    },

}));