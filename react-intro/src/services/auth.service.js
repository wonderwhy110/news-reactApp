import { instance } from "../api/axios.api"

export const AuthService ={
    async registration(userData){
        const {data} = await instance.post('user', userData)
        return data

    },
    async login(userData) {
        const {data} = await instance.post('auth/login', userData)
        return data
    },
    async getProfile(){
        const {data} = await instance.get('auth/profile')
        if(data){
            return data
        }
    }
}