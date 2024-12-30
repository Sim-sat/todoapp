import {MdOutlineKeyboardArrowLeft} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {Task} from "../types"
import React, {useState} from "react";
import {useDataContext} from "../Hooks/Datahook.tsx";

export default function AddEntry() {
    const navigate = useNavigate();
    const [task, setTask] = useState<Task>({
        name: "",
        description: "",
        id: crypto.randomUUID(),
        finished: false
    });

    const {setData} = useDataContext();

    const handleButtonClick = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
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
        navigate("/");
        await getAllTasks();
    }

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


    const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setTask((prevTask) => ({
                    ...prevTask,
                    [name]: value
                }
            )
        )
    }

    return (
        <div className="mt-6">
            <div className="flex w-16 ml-32 gap-48">
                <button
                    className="flex justify-center items-center h-12 w-12 rounded-full hover:bg-[#384268]"
                    onClick={() => navigate("/")}
                >
                    <MdOutlineKeyboardArrowLeft className="text-6xl "/>
                </button>
            </div>
            <form className="flex flex-col justify-center items-center gap-7 self-center w-full  ">
                <p className="font-bold text-3xl">Add New Task</p>
                <input
                    name="name"
                    className="bg-transparent border w-1/3 rounded-2xl p-3 focus:border-[#b624ff] outline-none"
                    placeholder="Task Name*"
                    type="text"
                    onChange={handleTaskChange}
                ></input>
                <textarea
                    name="description"
                    className="bg-transparent h-32 w-1/3 place-content-start border rounded-2xl p-2 focus:border-[#b624ff] outline-none"
                    placeholder="Task Description"
                    onChange={handleTaskChange}
                ></textarea>
                <button
                    className="w-1/3  h-20 text-2xl font-extrabold rounded-full bg-[#b624ff]"
                    onClick={handleButtonClick}
                >Create Task
                </button>
            </form>
        </div>
    );
}
