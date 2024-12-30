import React, {createContext, useState} from "react";
import {Task} from "../types.ts";

export interface DataContextType {
    data: Task[];
    setData: (data: Task[]) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataContextProviderProps {
    children: React.ReactNode;
}

export const DataContextProvider: React.FC<DataContextProviderProps> = ({children}) => {
    const [data, setData] = useState<Task[]>([]);

    return (
        <DataContext.Provider value={{data, setData}}>
            {children}
        </DataContext.Provider>
    )
}