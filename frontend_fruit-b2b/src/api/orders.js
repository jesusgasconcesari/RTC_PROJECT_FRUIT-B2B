const API_URL = "https://rtc-project-fruit-b2b.onrender.com/api/orders";

export const getOrders = async (token) => {
    try {
        const res = await fetch(API_URL, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) {
            throw new Error("Error al obtener pedidos");
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createOrder = async (orderData, token) => {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
         if (!res.ok) {
            throw new Error("Error al crear pedido");
         }
         return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getMyOrders = async (token) => {
    try {
        const res = await fetch(`${API_URL}/my-orders`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) {
            throw new Error("Error al obtener mis pedidos");
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getOrderById = async (id, token) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) {
            throw new Error("Error al obtener pedido");
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};