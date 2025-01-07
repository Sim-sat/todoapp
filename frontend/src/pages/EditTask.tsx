import {MdOutlineKeyboardArrowLeft} from "react-icons/md";
import {useNavigate, useParams} from "react-router-dom";
import {Task} from "../types"
import React, {useEffect, useState} from "react";
import {useDataContext} from "../Hooks/Datahook.tsx";
import Select from "react-select";
import makeAnimated from "react-select/animated";

export default function AddEntry() {
    const navigate = useNavigate();
    const [task, setTask] = useState<Task>({
        name: "",
        description: "",
        id: "",
        finished: false,
        timeCreated: "",
        categories: []
    });

    const {getAllTasks, getTask, addTask, deleteTask} = useDataContext();
    const {id} = useParams<{ id: string }>();
    const animatedComponents = makeAnimated();


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
            <div className="flex w-16 ml-32 gap-48">
                <button
                    className="flex justify-center items-center h-12 w-12 translate-x-32 rounded-full hover:bg-[#384268]"
                    onClick={() => navigate("/")}
                >
                    <MdOutlineKeyboardArrowLeft className="text-6xl "/>
                </button>
            </div>
            <form className="flex flex-col justify-center items-center gap-7 self-center w-full  ">
                <p className="font-bold text-3xl">Edit task</p>
                <input
                    name="name"
                    className="max-w-[720px] bg-transparent border w-1/3 rounded-2xl p-3 border-slate-600 focus:border-[#b624ff] hover:border-white  outline-none"
                    placeholder="Task Name*"
                    type="text"
                    onChange={handleTaskChange}
                    value={task.name}
                ></input>
                <textarea
                    name="description"
                    className="max-w-[720px] bg-transparent h-32 w-1/3 place-content-start border rounded-2xl p-2 border-slate-600 focus:border-[#b624ff] hover:border-white  outline-none"
                    placeholder="Task Description"
                    onChange={handleTaskChange}
                    value={task.description}
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
                    value={options.filter((option) => task.categories.includes(option.value))}
                />
                <button
                    className="max-w-[720px] w-1/3  h-20 text-2xl font-extrabold rounded-full hover:shadow-custom transition duration-250 bg-[#b624ff]"
                    onClick={handleButtonClick}
                >Update Task
                </button>
            </form>
        </div>
    );
}
