import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { base_url } from './BaseURL'
export default function Signup() {
    const [fullName, setFullName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [grade, setGrade] = useState("")
    const [gender, setGender] = useState("Male")
    const [flag, setFlag] = useState(false)
    const navigate = useNavigate()
    async function handleSignup() {
        console.log(username, password, grade);
        if (username.length >= 1 && password.length >= 1 && grade.length >= 1 && fullName.length >= 1 && gender.length >= 1) {
            try {
                const response = await axios.post(`${base_url}/user/signup`, {
                    fullName,
                    username,
                    password,
                    grade,
                    gender
                })
                alert(`Registred successfully
Username: ${username}
Password: ${password}`)
                navigate("/")
            } catch (error) {
                alert(error)
            }
        } else {
            setFlag(true)
            setTimeout(() => {
                setFlag(false)
            }, 3000);
        }
    }

    return (
        <div className="flex justify-center">
            <div className="p-10 bg-slate-700 mt-10 rounded-3xl shadow-xl flex flex-col gap-2">
                {
                    flag ? (
                        <p className="text-white">All Field Required</p>
                    ) : (
                        ""
                    )
                }
                <input className="p-2 text-white bg-slate-900 rounded-md m-1"
                    type="text"
                    placeholder="full name"
                    name="fullName"
                    value={fullName}
                    onChange={(event) => {
                        setFullName(event.target.value)
                    }}
                />
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
                <input
                    className="p-2 text-white bg-slate-900 rounded-md m-1"
                    type="text"
                    placeholder="grade"
                    name="grade"
                    value={grade}
                    onChange={(event) => {
                        setGrade(event.target.value)
                    }}
                />
                <div className="flex gap-4 text-white">
                    <div>
                        <input
                            className="p-2 text-white bg-slate-900 rounded-md m-1"
                            type="radio"
                            name="gender"
                            value="Male"
                            defaultChecked
                            id="b"
                            onChange={(event) => {
                                setGender(event.target.value)
                            }}
                        />
                        <label htmlFor="b">Male</label>
                    </div>
                    <div>
                        <input
                            className="p-2 text-white bg-slate-900 rounded-md m-1"
                            type="radio"
                            name="gender"
                            value="Female"
                            id="a"
                            onChange={(event) => {
                                setGender(event.target.value)
                            }}
                        />
                        <label htmlFor="a">Female</label>
                    </div>
                </div>
                <div className="flex justify-evenly">
                    <div>
                        <button
                            className="text-white bg-slate-900 p-4  rounded-lg cursor-pointer hover:bg-slate-800
                            hover:text-green-700
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