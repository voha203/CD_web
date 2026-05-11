import { createContext, useContext, useState } from "react";
import { getCart } from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = async () => {
        try {
            const res = await getCart();

            const totalQty = res.data.items.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            setCartCount(totalQty);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartCount,
                fetchCartCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);