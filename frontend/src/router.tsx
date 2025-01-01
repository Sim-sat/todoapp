import {lazy, ReactElement, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import {DataContextProvider} from "./context/Datacontext.tsx";
import {UserContextProvider} from "./context/UserContext.tsx";


const Home = lazy(() => import ("./pages/Home"));
const AddTask = lazy(() => import ("./pages/AddEntry"));
const TaskDetails = lazy(() => import ("./pages/TaskDetail"));
const EditTask = lazy(() => import ("./pages/EditTask.tsx"));
const LoginPage = lazy(() => import("./pages/Login.tsx"))

const AppRouter = (): ReactElement => {
    return (
        <UserContextProvider>
            <DataContextProvider>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/add" element={<AddTask/>}/>
                        <Route path="/tasks/:id" element={<TaskDetails/>}/>
                        <Route path="/edit/:id" element={<EditTask/>}/>
                        <Route path="/user" element={<LoginPage/>}/>
                    </Routes>
                </Suspense>
            </DataContextProvider>
        </UserContextProvider>
    )
}
export default AppRouter