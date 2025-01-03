import {useNavigate} from "react-router-dom";
import {Task} from "../types.ts";
import {useDataContext} from "../Hooks/Datahook.tsx";
import React, {useEffect, useState} from "react";
import {TaskList} from "../Components/TaskList.tsx";
import dayjs from "dayjs";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from "../Components/ProgressProvider.tsx";
import {FaRegUserCircle} from "react-icons/fa";
import {MdLogout} from "react-icons/md";
import {Tooltip} from "react-tooltip";
import {isDev} from "../../Constants.ts";
import {IoMdInformationCircleOutline} from "react-icons/io";
import {toast, ToastContainer} from "react-toastify";

export default function Home() {
    const navigate = useNavigate();
    const {data, getAllTasks, addTask, toggleDone, deleteTask} = useDataContext();
    const [percentage, setPercentage] = useState(50);
    const url = isDev() ? "http://localhost:5236" : "";


    useEffect(() => {
        const finishedTasks = data.filter((entry) => entry.finished).length;
        if (data.length === 0) {
            setPercentage(0);
        } else {
            const value = finishedTasks / data.length * 100;
            setPercentage(Math.floor(value));
        }
    }, [data]);

    useEffect(() => {
        getAllTasks();
    }, []);


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
                toast.success("Task deleted!", {autoClose: 1000});
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

    const handleLogout = async () => {
        sessionStorage.clear();

        try {
            const response = await fetch(`${url}/logout`, {
                method: "POST",
                credentials: 'include',
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
        window.location.reload();
    }


    return (
        <div className="flex flex-col items-center w-full h-screen">
            <ToastContainer/>
            <div className=" w-full justify-end pt-5  flex gap-24">
                <button
                    id="mybutton"
                    className="flex justify-center items-center hover:scale-[1.05] transition duration-250 hover:bg-my-grey rounded-full h-24 w-24 text-5xl mb-8 mr-56 ">
                    <FaRegUserCircle className="scale-[1.4]     bg-[#232e58] rounded-full "/>
                </button>
                <Tooltip anchorSelect={"#mybutton"} place="bottom" clickable
                         style={{zIndex: 9999}}
                         openOnClick={true}>
                    <div className="flex flex-col gap-5 w-48">
                        <button
                            name="done"
                            className="mr-10 flex gap-5 font-bold text-base hover:bg-[#38383c] w-full  pl-5 items-center h-12 rounded-xl "
                            onClick={() => navigate("/user")}>
                            <IoMdInformationCircleOutline
                                className="scale-150 "/> User
                        </button>
                        <div className="flex flex-col gap-5 w-48">
                            <button
                                name="done"
                                className="mr-10 flex gap-5 font-bold text-base hover:bg-[#38383c] w-full  pl-5 items-center h-12 rounded-xl "
                                onClick={handleLogout}>
                                <MdLogout
                                    className="scale-150 text-red-500 "/> Logout
                            </button>

                        </div>
                    </div>
                </Tooltip>
                <Tooltip anchorSelect={"#mybutton"} place="left" clickable
                         style={{zIndex: 9999}}
                         openOnClick={true}
                         defaultIsOpen={true}>
                    <div className="flex flex-col gap-5 w-48">
                        Log in to save tasks
                    </div>
                </Tooltip>

            </div>
            <div className="flex flex-col gap-5 items-center w-full mt-10  ">
                <div
                    className="bg-[#1a2145] h-32 w-1/2 flex items-center justify-start pr-80 rounded-3xl border  max-w-[720px] border-[#373c83] p-6 font-bold text-xl ">
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
