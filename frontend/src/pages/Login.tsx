import React, {useState} from "react";
import {isDev} from "../../Constants.ts";
import {MdOutlineKeyboardArrowLeft} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";

export default function Login() {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>();
    const url = isDev() ? "http://localhost:5236" : "";
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [login, setLogin] = useState(false);

    const handleRegister = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/register`, {
                method: "POST",
                body: JSON.stringify({email: email, password: password}),
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                mode: "cors",
            });
            if (response.status === 200) {
                toast.success("Register successfully");
                setLogin(true);
                setError(false);
            } else if (response.status === 400) {
                toast.error("Could not register");
                setError(true);
            }
            console.log(response);
        } catch (error) {
            console.log(error);
        }

    }

    const handleLogin = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/login?useCookies=true&useSessionCookies=true`, {
                method: "POST",
                body: JSON.stringify({email: email, password: password}),
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                mode: "cors",
                credentials: 'include'

            });
            if (response.status === 200) {
                navigate("/")
                sessionStorage.setItem("username", email)
            } else if (response.status === 401) {
                toast.error(response.statusText);
                setError(true);
                console.log("ich bin 401");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="mt-6">
            <ToastContainer/>
            <div className="flex w-16 ml-32 gap-48">
                <button
                    className="flex justify-center items-center h-12 w-12 rounded-full hover:bg-[#384268]"
                    onClick={() => navigate("/")}
                >
                    <MdOutlineKeyboardArrowLeft className="text-6xl "/>
                </button>

            </div>
            {!sessionStorage.getItem("username") ?
                <form className="flex flex-col justify-center items-center gap-7 self-center w-full  ">
                    <div
                        className="w-1/3  h-20 text-2xl flex font-extrabold rounded-xl border-slate-600 border  transition duration-250  justify-evenly">
                        <button className="hover:bg-[#4b5477] w-1/2" onClick={(e) => {
                            e.preventDefault();
                            setLogin(true)
                        }}>Login
                        </button>
                        <button className="hover:bg-[#4b5477] w-1/2" onClick={(e) => {
                            e.preventDefault();
                            setLogin(false)
                        }}>Register
                        </button>
                    </div>
                    <input
                        name="name"
                        className="bg-transparent border w-1/3 rounded-2xl p-3 border-slate-600 focus:border-[#b624ff] hover:border-white outline-none"
                        placeholder="Email"
                        type="text"
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    <input
                        name="name"
                        className="bg-transparent border w-1/3 rounded-2xl p-3 border-slate-600 focus:border-[#b624ff] hover:border-white outline-none"
                        placeholder="Password"
                        type="text"
                        onChange={(e) => setPassword(e.target.value)}
                        style={{borderColor: error ? "red" : ""}}
                    ></input>
                    {error && <p className="text-red-500">Username or Password are wrong</p>}
                    {login ? <button
                            className="w-1/3  h-20 text-2xl font-extrabold rounded-full hover:shadow-custom transition duration-250 bg-[#b624ff]"
                            onClick={handleLogin}
                        >Login
                        </button> :
                        <button
                            className="w-1/3  h-20 text-2xl font-extrabold rounded-full hover:shadow-custom transition duration-250 bg-[#b624ff]"
                            onClick={handleRegister}
                        >Register
                        </button>}
                </form> :
                <div className="flex w-full justify-center">
                    <div
                        className="flex flex-col w-1/2  max-w-[720px] shadow-2xl shadow-black mt-32 gap-5 text-lg p-5 rounded-xl">
                        <div className="flex w-full text-xl ">
                            <div className="flex-col flex items-start justify-start w-1/3 font-extrabold gap-6">
                                <p className="h-5">Email: </p>


                            </div>
                            <div className="flex-col flex items-start justify-start w-2/3 gap-6">
                                <p className="h-5">{sessionStorage.getItem("username")}</p>

                            </div>
                        </div>
                    </div>
                </div>

            }
        </div>
    )
}