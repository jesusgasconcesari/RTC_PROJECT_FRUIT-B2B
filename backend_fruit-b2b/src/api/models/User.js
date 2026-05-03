import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: { type: String, required: true },

        role: {
            type: String,
            enum: [ "admin", "client" ],
            default: "client",
        },

        businessName: { type: String, required: true },

        CIF: { type: String },

        address: { type: String },
    },
    {
        timestamps: true,
        collection: "users",
    }
);

export const User = mongoose.model("User", userSchema);