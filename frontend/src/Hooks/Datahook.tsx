import {DataContext, DataContextType} from "../context/Datacontext.tsx";
import {useContext} from "react";

export const useDataContext = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within DataContext.");
    }
    return context;
}