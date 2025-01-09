import {MdOutlineKeyboardArrowLeft} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {Task} from "../types"
import React, {useState} from "react";
import {useDataContext} from "../Hooks/Datahook.tsx";
import dayjs from "dayjs";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';


export default function AddEntry() {
    const navigate = useNavigate();
    const [task, setTask] = useState<Task>({
        name: "",
        description: "",
        id: crypto.randomUUID(),
        finished: false,
        timeCreated: "",
        categories: []
    });


    const animatedComponents = makeAnimated();

    const {getAllTasks, addTask} = useDataContext();

    const handleButtonClick = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        await addTask({...task, timeCreated: dayjs().format()});
        console.log(task);
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

    const handleChange = (selected: any) => {
        // Extrahiere die Werte aus den ausgewählten Optionen
        const values = selected ? selected.map((option: any) => option.value) : [];
        setTask((prevTask) => ({
            ...prevTask,
            categories: values
        }))
    };

    const options = [
        {value: '🏠 Home', label: '🏠 Home'},
        {value: '🏢 Work', label: '🏢 Work'},
        {value: '👤 Personal', label: '👤 Personal'}
    ]

    return (
        <div className="mt-6">
            <div className="flex w-16 ml-32 gap-48 ">
                <button
                    className="flex justify-center items-center h-12 w-12 translate-x-32 rounded-full hover:bg-[#384268]"
                    onClick={() => navigate("/")}
                >
                    <MdOutlineKeyboardArrowLeft className="text-6xl "/>
                </button>
            </div>
            <form className="flex flex-col justify-center items-center gap-7 self-center w-full  ">
                <p className="font-bold text-3xl max-w-[720px]">Add New Task</p>
                <input
                    name="name"
                    className="max-w-[720px] bg-transparent border w-1/3 rounded-2xl p-3 border-slate-600 focus:border-[#b624ff] hover:border-white outline-none"
                    placeholder="Task Name*"
                    type="text"
                    onChange={handleTaskChange}
                ></input>
                <textarea
                    name="description"
                    className="max-w-[720px] bg-transparent h-32 w-1/3 place-content-start border-slate-600 hover:border-white border rounded-2xl p-2 focus:border-[#b624ff] outline-none"
                    placeholder="Task Description"
                    onChange={handleTaskChange}
                ></textarea>
                <Select
                    className="max-w-[720px] bg-transparent w-1/3 place-content-start rounded-2xl p-2 "
                    closeMenuOnSelect={false}
                    styles={{
                        control: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: "",
                        }),
                        menu: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: "", // Hintergrund des Dropdown-Menüs transparent
                        }),
                        option: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: '#232e58', // Hintergrund der Optionen transparent
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#1f294f', // Option Hover Hintergrund
                            },
                        }),
                    }}
                    components={animatedComponents}
                    isMulti
                    options={options}
                    onChange={handleChange}
                />
                <button
                    className="w-1/3 max-w-[720px] h-20 text-2xl font-extrabold rounded-full disabled:hover:shadow-none disabled:grayscale-[0.5] hover:shadow-custom transition duration-250 bg-[#b624ff]"
                    onClick={handleButtonClick}
                    disabled={task.name === ""}
                >Create Task
                </button>
            </form>
        </div>
    );
}