import {useNavigate} from "react-router-dom";
import {Task} from "../types.ts";
import {useDataContext} from "../Hooks/Datahook.tsx";
import React, {ReactNode, useEffect} from "react";
import {IoMdMore} from "react-icons/io";
import {Tooltip} from "react-tooltip";
import {RiDeleteBin5Line} from "react-icons/ri";
import {MdDone, MdEdit} from "react-icons/md";
import {TbListDetails} from "react-icons/tb";
import {HiOutlineDuplicate} from "react-icons/hi";
import {IoCheckmarkDone} from "react-icons/io5";

export default function Home() {
    const navigate = useNavigate();
    const {data, setData} = useDataContext();

    const todoItems = (): ReactNode => {
        return data.map((task: Task) => {
            return (
                <div key={task.id}
                     className="w-1/2 h-20 bg-[#b624ff] rounded-full flex items-center pl-7 justify-between"
                     style={{backgroundColor: task.finished ? "#712299" : ""}}>
                    <p className="font-black text-xl flex gap-5 items-center"
                       style={{
                           textDecoration: task.finished ? "line-through" : "none",
                           color: task.finished ? "rgb(34 197 94" : ""
                       }}>
                        {task.finished && <IoCheckmarkDone className="scale-150 text-green-500"/>}{task.name}</p>
                    <button
                        id={`tooltip-button-${task.id}`}
                        className="mr-10 flex justify-center items-center h-10 w-10 hover:scale-125 rounded-full hover:bg-[#bd39ff]">
                        <IoMdMore
                            className="scale-150 "/></button>
                    <Tooltip anchorSelect={`#tooltip-button-${task.id}`} place="bottom" openOnClick={true} clickable
                             style={{zIndex: 9999}}>
                        <div className="flex flex-col gap-5 w-48">
                            <button
                                name="done"
                                className="mr-10 flex gap-5 font-bold text-base hover:bg-[#38383c] w-full  pl-5 items-center h-12 rounded-xl "
                                onClick={(event) => handleTooltipAction(event, task)}>
                                <MdDone
                                    className="scale-150 "/> Mark as done
                            </button>
                            <button
                                name="details"
                                className="mr-10 flex gap-5 font-bold text-base hover:bg-[#38383c] w-full  pl-5 items-center h-12 rounded-xl "
                                onClick={(event) => handleTooltipAction(event, task)}>
                                <TbListDetails
                                    className="scale-150 "/> Task Details
                            </button>
                            <button
                                name="edit"
                                className="mr-10 flex gap-5 font-bold text-base hover:bg-[#38383c] w-full pl-5 items-center h-12 rounded-xl "
                                onClick={(event) => handleTooltipAction(event, task)}>
                                <MdEdit
                                    className="scale-150 "/> Edit
                            </button>
                            <button
                                name="duplicate"
                                className="mr-10 flex gap-5 font-bold text-base hover:bg-[#38383c] w-full pl-5 items-center h-12 rounded-xl "
                                onClick={(event) => handleTooltipAction(event, task)}>
                                <HiOutlineDuplicate
                                    className="scale-150 "/> Duplicate
                            </button>
                            <button
                                name="delete"
                                className="mr-10 flex gap-5 font-bold text-base text-[#ff3131] hover:bg-[#38383c] w-full pl-5 items-center h-12 rounded-xl "
                                onClick={(event) => handleTooltipAction(event, task)}>
                                <RiDeleteBin5Line
                                    className="scale-150 "/> Delete
                            </button>
                        </div>
                    </Tooltip>

                </div>
            );
        });
    };


    useEffect(() => {
        getAllTasks();
    }, []);

    const handleTooltipAction = (event: React.MouseEvent<HTMLButtonElement>, task: Task) => {
        switch (event.currentTarget.name) {
            case "done":
                handleDone(task);
                break;
            case "details":
                handleDetails(task);
                break;
            case "edit":
                break;
            case "duplicate":
                handleDuplicate(task);
                break;
            case "delete":
                handleDelete(task);
                break;
            default:
                break;
        }
    }

    const handleDetails = (task: Task) => {
        navigate(`/tasks/${task.id}`);
    }

    const handleDuplicate = async (task: Task) => {
        const newTask = {...task, id: crypto.randomUUID(), finished: false};
        try {
            const response = await fetch("http://localhost:5236/add", {
                mode: "cors",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
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

    const handleDone = async (task: Task) => {
        try {
            const reponse = await fetch(`http://localhost:5236/update/${task.id}`, {
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

    const handleDelete = async (task: Task) => {
        try {
            const response = await fetch(`http://localhost:5236/delete/${task.id}`,
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

    const getAllTasks = async () => {
        try {
            const response = await fetch("http://localhost:5236/tasks", {
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

    return (
        <div className="flex flex-col items-center w-full h-screen">
            <p className="font-bold text-6xl pt-5 text-slate-300">TODO LIST</p>
            <div className="flex flex-col gap-5 items-center w-full mt-10 ">
                {todoItems()}
            </div>
            <form className="flex w-full h-screen items-end justify-end">
                <button
                    onClick={() => navigate("/add")}
                    className="flex justify-center items-center rounded-full h-14 w-14 text-5xl p-3 mb-5 mr-16 bg-[#b624ff]"
                >
                    +
                </button>
            </form>
        </div>
    );
}
