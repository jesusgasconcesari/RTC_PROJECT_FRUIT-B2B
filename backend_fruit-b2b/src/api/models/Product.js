import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        price: { type: Number, required: true },

        category: { type: String, required: true },

        stock: { type: Number, default: 0 },

        isSeasonal: { type: Boolean, default: false },

        minOrderQuantity: { type: Number, default: 1 },

        image: { type: String },

        unit: { type: String, required: true, enum: ["kg", "g", "l", "ml", "caja/s", "unidad/es"] },
    },
    {
        timestamps: true,
        collection: "products",
    }
);

export const Product = mongoose.model("Product", productSchema);

