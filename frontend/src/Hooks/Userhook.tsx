import {UserContext, UserContextType} from "../context/UserContext.tsx";
import {useContext} from "react";

export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within the context");
    }
    return context;
}