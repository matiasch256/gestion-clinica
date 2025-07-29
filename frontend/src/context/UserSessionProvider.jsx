import { Children, createContext, useEffect, useState } from "react";
import { AUTH_TOKEN } from "../axios";
import { axiosInstance } from "../axios";

export const UserSessionContext = createContext();

export const UserSessionProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data } = await axiosInstance.get("/shopping_cart");
      setCart(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    const token = localStorage.getItem(AUTH_TOKEN);
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <UserSessionContext.Provider
      value={{
        isLoggedin,
        handleLogin,
        cart,
        setCart,
        fetchCart,
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};
