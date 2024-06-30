import axios from "axios";
import { DOCTOR_SERVICE } from "@/config";

export const getDoctorDetails = async (doctorId: string) => {
  return axios.get(`${DOCTOR_SERVICE}/doctors/${doctorId}`);
};
