import React, {createContext, useState} from "react";
import {Task} from "../types.ts";
import dayjs from "dayjs";

export interface DataContextType {
    data: Task[];
    setData: (data: Task[]) => void;
    getAllTasks: () => Promise<void>;
    addTask: (task: Task) => Promise<void>;
    toggleDone: (id: string) => Promise<void>;
    deleteTask: (id: string | undefined) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataContextProviderProps {
    children: React.ReactNode;
}

export const DataContextProvider: React.FC<DataContextProviderProps> = ({children}) => {
    const [data, setData] = useState<Task[]>([{
        name: "first task",
        description: "Das ist toll",
        id: crypto.randomUUID(),
        finished: false,
        timeCreated: dayjs().format()
    }]);
    const getAllTasks = async () => {
        try {
            const response = await fetch("http://localhost:5236/get", {
                mode: "cors",
            });
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData);
                console.log(responseData);
            } else {
                console.error("Fehler beim Senden des Tasks!", response.status, response.statusText);
                alert("Fehler beim Senden des Tasks!");
            }
        } catch (error) {
            console.error("Fehler bei der Verbindung:", error);
        }
    }
    const addTask = async (task: Task) => {
        try {
            const response = await fetch("http://localhost:5236/add", {
                mode: "cors",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(task),
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log("Task erfolgreich gesendet:", responseData);
            } else {
                console.error("Fehler beim Senden des Tasks:", response.status, response.statusText);
                alert("Fehler beim Senden des Tasks!");
            }
        } catch (error) {
            console.error("Fehler bei der Verbindung:", error);
            alert("Fehler bei der Anfrage.");
        }
    }

    const toggleDone = async (id: string) => {
        try {
            const reponse = await fetch(`http://localhost:5236/update/${id}`, {
                method: "PATCH",
                mode: "cors"
            });
            if (reponse.ok) {
                console.log("Reponse succesfully");
                getAllTasks();
            } else {
                console.log("Error while changing stats");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteTask = async (id: string | undefined) => {
        try {
            const response = await fetch(`http://localhost:5236/delete/${id}`,
                {
                    mode: "cors",
                    method: "DELETE"
                });
            if (response.ok) {
                console.log("Successfully deleted task");
                getAllTasks();
            } else {
                console.log("Error occured while deleting task");
            }
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    return (
        <DataContext.Provider value={{data, setData, getAllTasks, addTask, toggleDone, deleteTask}}>
            {children}
        </DataContext.Provider>
    )
}