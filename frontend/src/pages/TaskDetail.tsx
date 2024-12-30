import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Task} from "../types.ts";
import {MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank, MdOutlineKeyboardArrowLeft} from "react-icons/md";
import dayjs from "dayjs";

export default function TaskDetail() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task>({
        name: "first task",
        description: "Das ist toll",
        id: crypto.randomUUID(),
        finished: false,
        timeCreated: dayjs().format()
    });

    useEffect(() => {
        // Simuliere das Laden eines Tasks (z.B. API-Aufruf)
        fetch(`http://localhost:5236/get/${id}`)
            .then((response) => response.json())
            .then((data) => setTask(data))
            .catch((error) => console.error("Error fetching task:", error));
    }, [id]);


    return (
        <div className="flex w-full justify-center">
            <button
                className="flex justify-center items-center mt-5 -translate-x-12 h-12 w-12 rounded-full hover:bg-[#384268]"
                onClick={() => navigate("/")}
            >
                <MdOutlineKeyboardArrowLeft className="text-6xl "/>
            </button>
            <div className="flex flex-col w-1/2  shadow-2xl shadow-black mt-32 gap-5 text-lg p-5 rounded-xl">
                <h1 className="font-extrabold w-full text-center text-3xl mb-5">Task: {task.name}</h1>
                <div className="flex w-full text-xl ">
                    <div className="flex-col flex items-start justify-start w-1/3 font-extrabold gap-6">
                        <p className="h-5">Description: </p>
                        <p className="h-5">Finished: </p>
                        <p className="h-5">ID: </p>
                        <p className="h-5">Created at: </p>

                    </div>
                    <div className="flex-col flex items-start justify-start w-2/3 gap-6">
                        <p className="h-5">{task.description}</p>
                        <p className="scale-125 h-5">{task.finished ? <MdOutlineCheckBox/> :
                            <MdOutlineCheckBoxOutlineBlank/>}</p>
                        <p className="h-5">{task.id}</p>
                        <p className="h-5">{dayjs(task.timeCreated).format("HH:mm DD.MM.YYYY")}</p>
                    </div>
                </div>

            </div>

        </div>
    );
}