import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {base_url} from './BaseURL'

export default function Students() {

    const navigate = useNavigate()
    const [users, setStudents] = useState([])

    let counter = 1; // counter variable

    useEffect(() => {

        try {
            axios.get(`${base_url}/admin/users/all`, { withCredentials: true, })
                .then(function (response) {
                    const studentsData = response.data
                    setStudents(studentsData.users);
                })
                .catch(error => {
                    console.log(error)
                    navigate("/admin")
                })
        } catch (error) {
            console.log(error);
        }

    }, [])


    return (
        <>

            <div className="flex flex-col overflow-x-auto m-1 bg-white">
                <div className="sm:-mx-2 lg:-mx-2">
                    <div className="inline-block w-auto py-2 sm:px-2 lg:px-2">
                        <div className="overflow-x-auto">
                            <table className="w-auto text-left text-sm font-light">
                                <thead className="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" className="px-2 py-2">ID</th>
                                        <th scope="col" className="px-2 py-2">Full Name</th>
                                        <th scope="col" className="px-2 py-2">Grade</th>
                                        <th scope="col" className="px-2 py-2">Gender</th>
                                        <th scope="col" className="px-2 py-2">Test Score</th>
                                        <th scope="col" className="px-2 py-2">Starts</th>
                                        <th scope="col" className="px-2 py-2">Ends</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map(user => (
                                        user.testStat.map((test, index) => (
                                            <tr key={`${user._id}-${test._id}`} className="border-b dark:border-neutral-500">
                                                {index === 0 && (
                                                    <>
                                                        <td className="whitespace-nowrap px-2 py-2">{counter++}</td>
                                                        <td className="whitespace-nowrap px-2 py-2">{user.fullName}</td>
                                                        <td className="whitespace-nowrap px-2 py-2">{user.grade}</td>
                                                        <td className="whitespace-nowrap px-2 py-2">{user.gender}</td>
                                                    </>
                                                )}
                                                {index !== 0 && (
                                                    <>
                                                        <td className="whitespace-nowrap px-2 py-2"></td>
                                                        <td className="whitespace-nowrap px-2 py-2"></td>
                                                        <td className="whitespace-nowrap px-2 py-2"></td>
                                                        <td className="whitespace-nowrap px-2 py-2"></td>
                                                    </>
                                                )}
                                                <td className="whitespace-nowrap px-2 py-2">{test.score}</td>
                                                <td className="whitespace-nowrap px-2 py-2">{test.testStartsTime}</td>
                                                <td className="whitespace-nowrap px-2 py-2">{test.testEndsTime}</td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 text-center">
                <button onClick={() => window.print()} className="bg-blue-500 text-white py-2 px-4 rounded">Print Table</button>
            </div>

        </>
    );
}