import {useNavigate} from "react-router-dom";
import {Task} from "../types.ts";
import {useDataContext} from "../Hooks/Datahook.tsx";
import React, {useEffect, useState} from "react";
import {TaskList} from "../Components/TaskList.tsx";
import dayjs from "dayjs";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from "../Components/ProgressProvider.tsx";

export default function Home() {
    const navigate = useNavigate();
    const {data, getAllTasks, addTask, toggleDone, deleteTask} = useDataContext();
    const [percentage, setPercentage] = useState(50);
    useEffect(() => {
        getAllTasks();
    }, []);


    useEffect(() => {
        const finishedTasks = data.filter((entry) => entry.finished).length;
        if (data.length === 0) {
            setPercentage(0);
        } else {
            const value = finishedTasks / data.length * 100;
            setPercentage(Math.floor(value));
        }
    }, [data]);

    const handleTooltipAction = (event: React.MouseEvent<HTMLButtonElement>, task: Task) => {
        switch (event.currentTarget.name) {
            case "done":
                toggleDone(task.id);
                break;
            case "details":
                navigate(`/tasks/${task.id}`);
                break;
            case "edit":
                navigate(`/edit/${task.id}`);
                break;
            case "duplicate":
                handleDuplicate(task);
                break;
            case "delete":
                deleteTask(task.id);
                break;
            default:
                break;
        }
    }

    const handleDuplicate = async (task: Task) => {
        const newTask = {
            ...task,
            id: crypto.randomUUID(),
            finished: false,
            timeCreated: dayjs().format()
        };
        await addTask(newTask);
        await getAllTasks();
    }

    return (
        <div className="flex flex-col items-center w-full h-screen">
            <p className="font-bold text-6xl pt-5 text-slate-300">TODO LIST</p>
            <div className="flex flex-col gap-5 items-center w-full mt-10 ">
                <div
                    className="bg-[#1a2145] h-32 w-1/2 flex items-center justify-start pr-80 rounded-3xl border border-[#373c83] p-6 font-bold text-xl ">
                    <ProgressProvider valueStart={0} valueEnd={percentage}>
                        {value =>
                            <CircularProgressbar value={value}
                                                 text={`${value}%`} className="h-24 w-24"
                                                 styles={buildStyles({
                                                     pathColor: "#b624ff",
                                                     textColor: "white",
                                                     trailColor: "#141a37",
                                                 })}/>}
                    </ProgressProvider>
                    <p className=" h-24 min-w-72 text-center flex justify-center items-center">Finished {data.filter((item) => item.finished).length} out
                        of {data.length} tasks</p>
                </div>
                <TaskList data={data} handleTooltipAction={handleTooltipAction}></TaskList>
            </div>

            <form className="flex w-full h-screen items-end justify-end">
                <button
                    onClick={() => navigate("/add")}
                    className="flex justify-center items-center hover:shadow-custom transition duration-250 rounded-full h-16 w-16 text-5xl p-3 mb-8 mr-56 bg-[#b624ff]">
                    +
                </button>
            </form>
        </div>
    );
}
