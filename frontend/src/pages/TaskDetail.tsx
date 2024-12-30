import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Task} from "../types.ts";

export default function TaskDetail() {
    const {id} = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);

    useEffect(() => {
        // Simuliere das Laden eines Tasks (z.B. API-Aufruf)
        fetch(`http://localhost:5236/get/${id}`)
            .then((response) => response.json())
            .then((data) => setTask(data))
            .catch((error) => console.error("Error fetching task:", error));
    }, [id]);


    return (
        <div className="flex w-full justify-center shadow-black items-center "
             style={{boxShadow: "rgba(0, 0, 0, 0.3) 0px 0px 24px 2px"}}>
            <div className="flex flex-col w-1/2 shadow-2xl mt-32">
                <p>PLAXEHOLDEr</p>
                <p>PLAXEHOLDEr</p>
                <p>PLAXEHOLDEr</p>
                <p>PLAXEHOLDEr</p>
                <p>PLAXEHOLDEr</p>
            </div>
        </div>
    )
}