import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { base_url } from './BaseURL'
function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [flag, setFlag] = useState(false)
    const navigate = useNavigate()

    // handling login
    async function handleLogin() {
        if ((username || password) === "") {
            alert("all field required")
            return;
        }
        setIsLoading(true)
        try {
            const response = await axios.post(`${base_url}/user/signin`, {
                username,
                password,
            })
            localStorage.setItem("token", response.data.accessToken)
            navigate("/home")
        } catch (error) {
            setFlag(true)
            setTimeout(() => {
                setFlag(false)
            }, 3000);
        } finally {
            setIsLoading(false)
        }
    }

    function handleSignup() {
        navigate("/signup")
    }

    return (
        <div className="flex justify-center m-4">
            <div className="p-10 bg-slate-700 mt-10 rounded-3xl shadow-xl flex flex-col gap-2">
                {
                    flag ? (
                        <p className="text-white">User Does Exists</p>
                    ) : (
                        ""
                    )
                }
                 <h4 className="text-white text-center mb-4">Welcome To MCQ Test System</h4>
                <input className="p-2 text-white bg-slate-900 rounded-md m-1"
                    type="text"
                    placeholder="username"
                    name="username"
                    value={username}
                    onChange={(event) => {
                        setUsername(event.target.value)
                    }}
                />
                <input
                    className="p-2 text-white bg-slate-900 rounded-md m-1"
                    type="password"
                    placeholder="password"
                    name="password"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value)
                    }}
                />
                <div className="flex justify-evenly">
                    <div>
                        <button
                            className="text-white bg-slate-900 p-2 px-4 hover:bg-green-800 rounded-lg cursor-pointer"
                            onClick={handleLogin}
                        >
                            {isLoading ? 'Wait 1 min' : 'Login'}
                        </button>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div>
                        <p className="text-white">If you are not registered, Register here</p>
                    </div>
                    <div>
                        <button
                            className="text-white bg-green-600 px-3 py-1 rounded-lg cursor-pointer hover:bg-slate-800
                            hover:text-white
                            "
                            onClick={handleSignup}
                        >
                            Signup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {
    Login,
}
