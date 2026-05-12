const API_URL = "https://rtc-project-fruit-b2b.onrender.com/api/products/";

export const getProducts = async (token) => {
    try {
        const res = await fetch(API_URL, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
        });
        if (!res.ok) {
            throw new Error("Error al obtener productos");
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createProduct = async (productData, token) => {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(productData)
        });
        if (!res.ok) {
            throw new Error("Error al crear producto");
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

