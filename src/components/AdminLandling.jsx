import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { base_url } from './BaseURL'

export default function Students() {

    const navigate = useNavigate()
    const [users, setStudents] = useState([])

    useEffect(() => {
        try {
            axios.get(`${base_url}/admin/users/all`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("adminToken")
                }
            }).then(function (response) {
                const studentsData = response.data
                setStudents(studentsData.users);
            }).catch(error => {
                navigate("/admin")
                return;
            })
        } catch (error) {
            console.log("birendra boahra")
            navigate("/admin")
        }
    }, [])

    function handleLogout() {
        localStorage.removeItem("adminToken")
        navigate("/admin")
    }


    return (
        <>
            <div className='flex justify-end text-white  mt-4 w-3/4 m-auto'>
                <div>
                    <button
                        onClick={handleLogout}
                        className="p-1 bg-blue-800 rounded-md px-2 hover:bg-blue-900 ">
                        logout
                    </button>
                </div>
            </div>
            <div className='w-3/4 m-auto mt-10 mb-10 grid grid-cols-1 sm:grid-cols-12 text-white gap-4 items-center'>
                {
                    users.map((user, index) => (
                        <>
                            <div key={user._id} className='p-2 bg-gradient-to-r from-emerald-500 to-emerald-900 font-extrabold sm:col-span-4 rounded-md'>
                                <p>Name:{user.fullName} </p>
                                <p>Grade: {user.grade} </p>
                                <p>Gender: {user.gender} </p>
                            </div>
                            <div key={Math.random()} className='p-1 bg-gradient-to-r from-stone-500 to-stone-700 sm:col-span-5 rounded-md'>
                                {
                                    user.testStat.map((test, index) => (
                                        <div key={index} className='m-1 p-1 bg-slate-800 rounded-md'>
                                            <div key={Math.random()}>Starts:{test.testStartsTime}</div>
                                            <div key={Math.random()}>Ends:{test.testEndsTime}</div>
                                            <div key={Math.random()}>Score:{test.score}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    ))
                }
            </div>
        </>
    );
}