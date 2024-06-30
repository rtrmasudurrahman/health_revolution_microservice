import axios from "axios";
import { CART_SERVICE } from "@/config";

export const getCartDetails = async (cartSessionId: string) => {
  return axios.get(`${CART_SERVICE}/cart/me`, {
    headers: { "x-cart-session-id": cartSessionId },
  });
};

export const clearCart = async (cartSessionId: string) => {
  return axios.get(`${CART_SERVICE}/cart/clear`, {
    headers: { "x-cart-session-id": cartSessionId },
  });
};
