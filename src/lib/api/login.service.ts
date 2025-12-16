// แยก logic การเรียก API ออกมา
import axios from "axios"

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    id: string
    email: string
    accessToken: string
  }
}


export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse['data'] | null> {
  try {
    const { email, password } = credentials
    const apiResponse = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/adminLogin`,
      {
        username: email,
        password,
      }
    )

    return apiResponse.data.data
  } catch (error) {
    console.error("Login Error:", error)
    return null
  }
}