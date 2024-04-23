import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { base_url } from './BaseURL';

export default function Signup() {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [grade, setGrade] = useState("");
    const [gender, setGender] = useState("Male");
    const [studImage, setStudImage] = useState("");
    const [flag, setFlag] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const navigate = useNavigate();

    function handleFileChange(e) {
        const selectedFile = e.target.files[0];
        setStudImage(selectedFile);
        setSelectedFileName(selectedFile ? selectedFile.name : "");
    }

    async function handleSignup() {
        setIsLoading(true); // Set loading to true while signing up

        if (username.length >= 1 && password.length >= 1 && grade.length >= 1 && fullName.length >= 1 && gender.length >= 1) {
            const formData = new FormData();
            formData.append("studImage", studImage);
            formData.append("fullName", fullName);
            formData.append("username", username);
            formData.append("password", password);
            formData.append("grade", grade);
            formData.append("gender", gender);

            try {
                const response = await axios.post(`${base_url}/user/signup`, formData);
                alert(`Registered successfully
Username: ${username}
Password: ${password}`);
                navigate("/");
            } catch (error) {
                alert(error);
            } finally {
                setIsLoading(false); // Set loading to false after signup completion (success or error)
            }
        } else {
            setFlag(true);
            setTimeout(() => {
                setFlag(false);
            }, 3000);
            setIsLoading(false); // Set loading to false if validation fails
        }
    }

    return (
        <div className="flex justify-center">
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSignup();
            }}>
                <div className="p-10 bg-slate-700 mt-10 rounded-3xl shadow-xl flex flex-col gap-2">
                    {flag ? (
                        <p className="text-white">All Field Required</p>
                    ) : (
                        ""
                    )}
                    <input className="p-2 text-white bg-slate-900 rounded-md m-1"
                        type="text"
                        placeholder="full name"
                        name="fullName"
                        value={fullName}
                        onChange={(event) => {
                            setFullName(event.target.value);
                        }}
                    />
                    <input className="p-2 text-white bg-slate-900 rounded-md m-1"
                        type="text"
                        placeholder="username"
                        name="username"
                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    />
                    <input
                        className="p-2 text-white bg-slate-900 rounded-md m-1"
                        type="password"
                        placeholder="password"
                        name="password"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <input
                        className="p-2 text-white bg-slate-900 rounded-md m-1"
                        type="text"
                        placeholder="grade"
                        name="grade"
                        value={grade}
                        onChange={(event) => {
                            setGrade(event.target.value);
                        }}
                    />

                    <div className="flex items-center m-1 p-1 gap-1">
                        <input type="file" className="hidden" id="customFileInput"
                            onChange={(e) => handleFileChange(e)}
                        />
                        <label htmlFor="customFileInput" className="px-2 py-2 bg-slate-900 text-white rounded-md cursor-pointer hover:bg-green-600">
                            Choose Photo
                        </label>
                        <span id="selectedFileName" className="text-white">{selectedFileName}</span>
                    </div>

                    <div className="flex gap-4 text-white">
                        <div>
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                defaultChecked
                                id="b"
                                onChange={(event) => {
                                    setGender(event.target.value);
                                }}
                            />
                            <label htmlFor="b">Male</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                id="a"
                                onChange={(event) => {
                                    setGender(event.target.value);
                                }}
                            />
                            <label htmlFor="a">Female</label>
                        </div>
                    </div>

                    <div className="flex justify-evenly">
                        <div>
                            <button
                                type="submit"
                                className="text-white bg-slate-900 p-4 rounded-lg cursor-pointer hover:bg-slate-800
                                hover:text-green-700"
                                disabled={isLoading} // Disable the button while loading
                            >
                                {isLoading ? 'Wait 1 min' : 'Signup'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
