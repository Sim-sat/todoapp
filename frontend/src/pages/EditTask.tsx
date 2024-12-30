import {MdOutlineKeyboardArrowLeft} from "react-icons/md";
import {useNavigate, useParams} from "react-router-dom";
import {Task} from "../types"
import React, {useEffect, useState} from "react";
import {useDataContext} from "../Hooks/Datahook.tsx";

export default function AddEntry() {
    const navigate = useNavigate();
    const [task, setTask] = useState<Task>({
        name: "",
        description: "",
        id: "",
        finished: false,
        timeCreated: "",
    });

    const {getAllTasks, getTask, addTask, deleteTask} = useDataContext();
    const {id} = useParams<{ id: string }>();


    useEffect(() => {
        getTask(id).then(task => {
            if (task !== null) setTask(task)
        });
    }, [getTask, id]);

    const handleButtonClick = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        await deleteTask(id);
        await addTask(task);
        navigate("/");
        await getAllTasks();
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
                <p className="font-bold text-3xl">Edit task</p>
                <input
                    name="name"
                    className="bg-transparent border w-1/3 rounded-2xl p-3 focus:border-[#b624ff] outline-none"
                    placeholder="Task Name*"
                    type="text"
                    onChange={handleTaskChange}
                    value={task.name}
                ></input>
                <textarea
                    name="description"
                    className="bg-transparent h-32 w-1/3 place-content-start border rounded-2xl p-2 focus:border-[#b624ff] outline-none"
                    placeholder="Task Description"
                    onChange={handleTaskChange}
                    value={task.description}
                ></textarea>
                <button
                    className="w-1/3  h-20 text-2xl font-extrabold rounded-full hover:shadow-custom transition duration-250 bg-[#b624ff]"
                    onClick={handleButtonClick}
                >Update Task
                </button>
            </form>
        </div>
    );
}
