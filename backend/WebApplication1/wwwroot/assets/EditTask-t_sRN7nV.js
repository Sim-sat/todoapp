import{u as h,r as c,a as b,j as e}from"./index-sC0jSauN.js";import{c as g}from"./index-NwRbqxpA.js";import{u as w}from"./Datahook-CFAyzkTw.js";function v(){const n=h(),[t,r]=c.useState({name:"",description:"",id:"",finished:!1,timeCreated:""}),{getAllTasks:i,getTask:l,addTask:d,deleteTask:u}=w(),{id:s}=b();c.useEffect(()=>{l(s).then(a=>{a!==null&&r(a)})},[l,s]);const x=async a=>{a.preventDefault(),await u(s),await d(t),n("/"),await i()},o=a=>{const{name:m,value:f}=a.target;r(p=>({...p,[m]:f}))};return e.jsxs("div",{className:"mt-6",children:[e.jsx("div",{className:"flex w-16 ml-32 gap-48",children:e.jsx("button",{className:"flex justify-center items-center h-12 w-12 translate-x-32 rounded-full hover:bg-[#384268]",onClick:()=>n("/"),children:e.jsx(g,{className:"text-6xl "})})}),e.jsxs("form",{className:"flex flex-col justify-center items-center gap-7 self-center w-full  ",children:[e.jsx("p",{className:"font-bold text-3xl",children:"Edit task"}),e.jsx("input",{name:"name",className:"max-w-[720px] bg-transparent border w-1/3 rounded-2xl p-3 focus:border-[#b624ff] outline-none",placeholder:"Task Name*",type:"text",onChange:o,value:t.name}),e.jsx("textarea",{name:"description",className:"max-w-[720px] bg-transparent h-32 w-1/3 place-content-start border rounded-2xl p-2 focus:border-[#b624ff] outline-none",placeholder:"Task Description",onChange:o,value:t.description}),e.jsx("button",{className:"max-w-[720px] w-1/3  h-20 text-2xl font-extrabold rounded-full hover:shadow-custom transition duration-250 bg-[#b624ff]",onClick:x,children:"Update Task"})]})]})}export{v as default};