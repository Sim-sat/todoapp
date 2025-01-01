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
    const url = isDev() ? "http://localhost:5236" : "";
    const getAllTasks = async () => {
        try {
            const response = await fetch(`${url}/tasks`, {
                mode: "cors",
                method: "GET",
                credentials: 'include',
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
            const response = await fetch(`${url}/add`, {
                mode: "cors",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: 'include',
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
            const reponse = await fetch(`${url}/update/${id}`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: 'include',
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
            const response = await fetch(`${url}/delete/${id}`,
                {
                    mode: "cors",
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    credentials: 'include',
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
            const response = await fetch(`${url}/task/${id}`, {
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: 'include',
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