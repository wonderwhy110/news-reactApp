import { useAppSelector } from "../store/hooks"

export const useAuth= () => {
    const isAuth = useAppSelector((state => state.user.isAuth))
    return isAuth
}