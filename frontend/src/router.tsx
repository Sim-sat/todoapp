import {lazy, ReactElement, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import {DataContextProvider} from "./context/Datacontext.tsx";


const Home = lazy(() => import ("./pages/Home"));
const AddTask = lazy(() => import ("./pages/AddEntry"));
const TaskDetails = lazy(() => import ("./pages/TaskDetail"));

const AppRouter = (): ReactElement => {
    return (
        <DataContextProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>

                    <Route path="/" element={<Home/>}/>
                    <Route path="/add" element={<AddTask/>}/>
                    <Route path="/tasks/:id" element={<TaskDetails/>}/>
                </Routes>
            </Suspense>
        </DataContextProvider>
    )
}
export default AppRouter