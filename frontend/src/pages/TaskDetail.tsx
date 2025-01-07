import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Task} from "../types.ts";
import {MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank, MdOutlineKeyboardArrowLeft} from "react-icons/md";
import dayjs from "dayjs";
import {useDataContext} from "../Hooks/Datahook.tsx";

export default function TaskDetail() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task>({
        name: "",
        description: "",
        id: crypto.randomUUID(),
        finished: false,
        timeCreated: "",
        categories: []
    });

    const {getTask} = useDataContext();

    useEffect(() => {
        getTask(id).then(task => {
            if (task !== null) setTask(task)
        });
    }, [getTask, id]);


    return (
        <div className="flex w-full justify-center">
            <button
                className="flex justify-center items-center mt-5 -translate-x-12 h-12 w-12 rounded-full hover:bg-[#384268]"
                onClick={() => navigate("/")}
            >
                <MdOutlineKeyboardArrowLeft className="text-6xl "/>
            </button>
            <div
                className=" max-w-[720px] flex flex-col w-1/2  shadow-2xl shadow-black mt-32 gap-5 text-lg p-5 rounded-xl">
                <h1 className="font-extrabold w-full text-center text-3xl mb-5">Task: {task.name}</h1>
                <div className="flex w-full text-xl ">
                    <div className="flex-col flex items-start justify-start w-1/3 font-extrabold gap-6">
                        <p className="h-5">Description: </p>
                        <p className="h-5">Finished: </p>
                        <p className="h-5">ID: </p>
                        <p className="h-5">Created at: </p>
                        <p className="h-5">Categories: </p>

                    </div>
                    <div className="flex-col flex items-start justify-start w-2/3 gap-6">
                        <p className="h-5">{task.description}</p>
                        <p className="scale-125 h-5">{task.finished ? <MdOutlineCheckBox/> :
                            <MdOutlineCheckBoxOutlineBlank/>}</p>
                        <p className="h-5">{task.id}</p>
                        <p className="h-5">{dayjs(task.timeCreated).format("HH:mm DD.MM.YYYY")}</p>
                        <p className="flex gap-5 text-black"
                        >{task.categories.map((category: string) => <span
                            className="bg-[#1fff44] p-1 border border-white px-3 rounded-xl"
                            style={{filter: task.finished ? "brightness(0.75)" : "brightness(1)"}}
                        >{category}</span>)}</p>

                    </div>
                </div>

            </div>

        </div>
    );
}