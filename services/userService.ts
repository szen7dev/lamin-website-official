import api from "./api"

export const userService = {
  getUserProfile: async () => {
    const response = await api.get("/users/profile")
    return response.data
  },
  updateUserProfile: async (userData: any) => {
    const response = await api.put("/users/profile", userData)
    return response.data
  },
  changePassword: async (passwordData: any) => {
    const response = await api.put("/users/password", passwordData)
    return response.data
  },
}

