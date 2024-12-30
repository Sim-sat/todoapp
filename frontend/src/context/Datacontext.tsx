import React, {createContext, useState} from "react";
import {Task} from "../types.ts";
import {isDev} from "../../Constants.ts";

export interface DataContextType {
    data: Task[];
    setData: (data: Task[]) => void;
    getAllTasks: () => Promise<void>;
    addTask: (task: Task) => Promise<void>;
    toggleDone: (id: string) => Promise<void>;
    deleteTask: (id: string | undefined) => Promise<void>;
    getTask: (id: string | undefined) => Promise<Task | null>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataContextProviderProps {
    children: React.ReactNode;
}

export const DataContextProvider: React.FC<DataContextProviderProps> = ({children}) => {
    const [data, setData] = useState<Task[]>([]);
    const port = isDev() ? 5236 : 5000;

    const getAllTasks = async () => {
        try {
            const response = await fetch(`/tasks`, {
                mode: "cors",
            });
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData);
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
            const response = await fetch(`/add`, {
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
            const reponse = await fetch(`/update/${id}`, {
                method: "PATCH",
                mode: "cors"
            });
            if (reponse.ok) {
                console.log("Reponse succesfully", port);
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
            const response = await fetch(`/delete/${id}`,
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

    const getTask = async (id: string | undefined): Promise<Task | null> => {

        try {
            const response = await fetch(`/task/${id}`, {
                mode: "cors"
            });
            if (response.ok) {
                return await response.json();
            } else {
                console.error("Fehler beim Laden des Tasks!");

            }
        } catch (error) {
            console.error("Fehler bei der Verbindung:", error);
        }
        return null;
    }
    return (
        <DataContext.Provider value={{data, setData, getAllTasks, addTask, toggleDone, deleteTask, getTask}}>
            {children}
        </DataContext.Provider>
    )
}