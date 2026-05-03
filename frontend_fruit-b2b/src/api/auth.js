const API_URL = "/api/auth/";

export const loginUser = async (email, password) => {
    try {
        const res = await fetch(`${API_URL}login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            throw new Error("Error al loguear usuario");
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const registerUser = async (data) => {
    try {
        const res = await fetch(`${API_URL}register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            throw new Error("Error al registrar usuario");
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
