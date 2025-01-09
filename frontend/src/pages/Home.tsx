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
import {SpinningCircles} from 'react-loading-icons'


export default function Home() {
    const navigate = useNavigate();
    const {data, getAllTasks, addTask, toggleDone, deleteTask} = useDataContext();
    const [percentage, setPercentage] = useState(50);
    const url = isDev() ? "http://localhost:5236" : "";
    const [search, setSearch] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [countdown, setCountdown] = useState(15);
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Record<string, boolean>>({
        "🏠 Home": false,
        "🏢 Work": false,
        "👤 Personal": false
    });

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
        const fetchTasks = async () => {
            try {
                await getAllTasks(); // Versuche, die Daten zu laden
                setLoaded(true); // Erfolgreich geladen
                console.log("Tasks successfully loaded!");
            } catch (error) {
                console.error("Error fetching tasks:", error);
                let countdown = 15; // Countdown-Wert
                setCountdown(countdown); // Initialen Countdown-Wert setzen

                const interval = setInterval(() => {
                    countdown -= 1;
                    setCountdown(countdown);

                    if (countdown === 0) {
                        clearInterval(interval); // Timer stoppen, wenn Countdown 0 erreicht
                        window.location.reload(); // Seite neu laden
                    }
                }, 1000);

                return () => clearInterval(interval);
            }

        }
        fetchTasks();
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

    const filterCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
        const value = e.currentTarget.name;
        setSelectedCategory((prev) => ({
            ...prev,
            [value]: !prev[value],
        }));
        console.log(value);
        setCategoryFilter((prev: string[]) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };


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
                {!loaded && <Tooltip anchorSelect={"#mybutton"} place="left" clickable
                                     style={{zIndex: 9999}}
                                     openOnClick={true}
                                     defaultIsOpen={true}>
                    <div className="flex flex-col gap-5 w-48">
                        Log in to save tasks
                    </div>
                </Tooltip>}

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
                <input
                    type="text"
                    placeholder="Search for task..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-[#1a2145] h-16 w-1/2 flex items-center justify-start pr-80 outline-0 rounded-3xl border  focus:border-[#373c83] outline-none max-w-[720px] border-[#373c83] p-6 ">
                </input>
                {loaded && <div className="text-black flex gap-5">
                    <button name="🏠 Home"
                            className="bg-[#1fff44] p-1 border border-white px-3 rounded-xl hover:bg-[#1be53d]"
                            style={{
                                scale: selectedCategory["🏠 Home"] ? "1.1" : "1",
                                borderColor: selectedCategory["🏠 Home"] ? "#b624ff " : "",
                                borderWidth: selectedCategory["🏠 Home"] ? 3 : 1
                            }}
                            onClick={filterCategory}>🏠 Home
                    </button>
                    <button name="🏢 Work"
                            className="bg-[#1fff44] p-1 border border-white px-3 rounded-xl hover:bg-[#1be53d]"
                            style={{
                                scale: selectedCategory["🏢 Work"] ? "1.1" : "1",
                                borderColor: selectedCategory["🏢 Work"] ? "#b624ff " : "",
                                borderWidth: selectedCategory["🏢 Work"] ? 3 : 1
                            }}
                            onClick={filterCategory}>🏢 Work
                    </button>
                    <button name="👤 Personal"
                            style={{
                                scale: selectedCategory["👤 Personal"] ? "1.1" : "1",
                                borderColor: selectedCategory["👤 Personal"] ? "#b624ff " : "",
                                borderWidth: selectedCategory["👤 Personal"] ? 3 : 1
                            }}
                            className="bg-[#1fff44] p-1 border border-white px-3 rounded-xl hover:bg-[#1be53d]"
                            onClick={filterCategory}>👤 Personal
                    </button>
                </div>}
                {!loaded &&
                    <>
                        <div className="font-bold text-2xl">SQL Server needs time to start. Takes About 1 minute</div>
                        <div>
                            Retry in: {countdown}
                            <SpinningCircles/>
                        </div>
                    </>}
                <TaskList data={data} searchQuery={search} handleTooltipAction={handleTooltipAction}
                          categoryFilter={categoryFilter}></TaskList>
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
