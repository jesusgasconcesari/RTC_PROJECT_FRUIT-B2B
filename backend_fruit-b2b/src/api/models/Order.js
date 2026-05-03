import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(

    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },

                quantity: { type: Number, required: true },
                price: { type: Number, required: true }
            }
        ],

        totalPrice: { type: Number, required: true },

        status: {
            type: String,
            enum: [ "pending", "confirmed", "shipped", "delivered", "cancelled" ],
            default: "pending"
        }
    },
    {
        timestamps: true,
        collection: "orders"
    }
);

export const Order = mongoose.model("Order", orderSchema);