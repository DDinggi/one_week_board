import axios from "module";
import { headers } from "next/headers";

const apiClint = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers : {
    "Content-Type" : "application/json",
  }
});




export const loginUserApi = async (data) => {
  // data 예시: { userId: "backend5555", password: "password123" }
  const response = await apiClient.post('/auth/login', {
        email: form.email,
        password: form.password,
      })

  // 성공 시 response.data 안에 { access_token: "..." }이 들어있습니다.
  return response.data
}