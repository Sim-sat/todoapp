import React, {ReactNode} from "react";
import {Task} from "../types.ts";
import {IoCheckmarkDone} from "react-icons/io5";
import {IoMdMore} from "react-icons/io";
import {Tooltip} from "react-tooltip";
import {MdDone, MdEdit} from "react-icons/md";
import {TbListDetails} from "react-icons/tb";
import {HiOutlineDuplicate} from "react-icons/hi";
import {RiDeleteBin5Line} from "react-icons/ri";
import dayjs from "dayjs";

interface myProps {
    data: Task[],
    handleTooltipAction: (event: React.MouseEvent<HTMLButtonElement>, task: Task) => void;
}

export const TaskList = (props: myProps): ReactNode => {

    return props.data.map((task: Task) => {
        return (
            <div key={task.id}
                 className="max-w-[720px] w-1/2 h-20 bg-[#b624ff] hover:shadow-custom transition duration-250 rounded-full flex items-center pl-7 "
                 style={{backgroundColor: task.finished ? "#712299" : ""}}>
                <p className="font-black text-xl flex gap-5 items-center  w-1/2"
                   style={{
                       textDecoration: task.finished ? "line-through" : "none",
                       color: task.finished ? "rgb(34 197 94" : ""
                   }}>
                    {task.finished && <IoCheckmarkDone className="scale-150 text-green-500"/>}{task.name}</p>
                <p className="ml-96 ">{dayjs(task.timeCreated).isSame(dayjs(), "week") ? `today, ${dayjs(task.timeCreated).format("HH:mm")}` : dayjs(task.timeCreated).format("DD:MM:YYYY")}</p>
                <button
                    id={`tooltip-button-${task.id}`}
                    className="mr-10 flex justify-center items-center h-10 w-10 rounded-full hover:bg-[#bd39ff]">
                    <IoMdMore
                        className="scale-150 "/></button>
                <Tooltip anchorSelect={`#tooltip-button-${task.id}`} place="bottom" openOnClick={true} clickable
                         style={{zIndex: 9999}}>
                    <div className="flex flex-col gap-5 w-48">
                        <button
                            name="done"
                            className="mr-10 flex gap-5 font-bold text-base hover:bg-[#38383c] w-full  pl-5 items-center h-12 rounded-xl "
                            onClick={(event) => props.handleTooltipAction(event, task)}>
                            <MdDone
                                className="scale-150 "/> Mark as done
                        </button>
                        <button
                            name="details"
                            className="mr-10 flex gap-5 font-bold text-base hover:bg-[#38383c] w-full  pl-5 items-center h-12 rounded-xl "
                            onClick={(event) => props.handleTooltipAction(event, task)}>
                            <TbListDetails
                                className="scale-150 "/> Task Details
                        </button>
                        <button
                            name="edit"
                            className="mr-10 flex gap-5 font-bold text-base hover:bg-[#38383c] w-full pl-5 items-center h-12 rounded-xl "
                            onClick={(event) => props.handleTooltipAction(event, task)}>
                            <MdEdit
                                className="scale-150 "/> Edit
                        </button>
                        <button
                            name="duplicate"
                            className="mr-10 flex gap-5 font-bold text-base hover:bg-[#38383c] w-full pl-5 items-center h-12 rounded-xl "
                            onClick={(event) => props.handleTooltipAction(event, task)}>
                            <HiOutlineDuplicate
                                className="scale-150 "/> Duplicate
                        </button>
                        <button
                            name="delete"
                            className="mr-10 flex gap-5 font-bold text-base text-[#ff3131] hover:bg-[#38383c] w-full pl-5 items-center h-12 rounded-xl "
                            onClick={(event) => props.handleTooltipAction(event, task)}>
                            <RiDeleteBin5Line
                                className="scale-150 "/> Delete
                        </button>
                    </div>
                </Tooltip>

            </div>
        );
    });
};
