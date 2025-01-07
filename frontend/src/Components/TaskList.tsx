import React, {ReactNode} from "react";
import {Task} from "../types.ts";
import {IoMdMore} from "react-icons/io";
import {Tooltip} from "react-tooltip";
import {MdDone, MdEdit} from "react-icons/md";
import {TbListDetails} from "react-icons/tb";
import {HiOutlineDuplicate} from "react-icons/hi";
import {RiDeleteBin5Line} from "react-icons/ri";
import dayjs from "dayjs";
import Highlight from "react-highlight-words";
import {IoCheckmarkDone} from "react-icons/io5";

interface myProps {
    data: Task[],
    handleTooltipAction: (event: React.MouseEvent<HTMLButtonElement>, task: Task) => void;
    searchQuery: string,
    categoryFilter: string[];
}

export const TaskList = (props: myProps): ReactNode => {

    const {data, searchQuery, categoryFilter} = props;
    let filteredList: Task[] = data;

    if (searchQuery !== "") {
        filteredList = data.filter((task: Task) => {
            return task.name.includes(searchQuery);
        })
    }
    console.log(categoryFilter);
    if (categoryFilter.length !== 0) {
        categoryFilter.forEach(filter => {
            filteredList = data.filter((task: Task) => {
                return task.categories.includes(filter);
            })
        })

    }


    return filteredList.map((task: Task) => {
        return (
            <>
                <div key={task.id}
                     className="max-w-[720px] w-1/2 h-24 bg-[#b624ff] overflow-hidden justify-between hover:shadow-custom transition duration-250 rounded-full flex items-center pl-7 "
                     style={{
                         backgroundColor: task.finished ? "#712299" : "",
                         filter: task.finished ? "grayscale(0.3)" : "grayscale(0) brightness(1)"
                     }}>
                 <span className={`${task.finished ? "block" : "hidden"}`}> {task.finished && <IoCheckmarkDone
                     className="scale-150 text-green-500 "/>}</span>
                    <div className="w-1/2 gap-1 flex flex-col ">
                        <p className="font-black text-xl flex gap-5 items-center  w-1/2"
                           style={{
                               textDecoration: task.finished ? "line-through" : "none",
                               color: task.finished ? "rgb(34 197 94" : ""
                           }}>

                            <Highlight
                                searchWords={[searchQuery]}
                                autoEscape={true}
                                caseSensitive={false}
                                textToHighlight={task.name}
                                highlightStyle={{backgroundColor: "rgba(0,0,255,0.7)", color: "white"}}
                            /></p>
                        <p className="flex gap-5 text-black"
                        >{task.categories.map((category: string) => <span
                            className="bg-[#1fff44] p-1 border border-white px-3 rounded-xl"
                            style={{filter: task.finished ? "brightness(0.75)" : "brightness(1)"}}
                        >{category}</span>)}</p>
                    </div>
                    <p className="">{dayjs(task.timeCreated).isSame(dayjs(), "week") ? `today, ${dayjs(task.timeCreated).format("HH:mm")}` : dayjs(task.timeCreated).format("DD:MM:YYYY")}</p>
                    <button
                        id={`tooltip-button-${task.id}`}
                        className="mr-10 flex justify-center items-center h-10 w-10 rounded-full hover:bg-[#bd39ff]">
                        <IoMdMore
                            className="scale-150 "/></button>

                </div>
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
            </>
        );
    });
};
