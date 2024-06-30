import axios from "axios";
import { PRODUCT_SERVICE } from "@/config";

export const getProductDetails = async (productId: string) => {
  return await axios.get(`${PRODUCT_SERVICE}/products/${productId}`);
};
