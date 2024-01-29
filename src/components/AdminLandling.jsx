import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { base_url } from './BaseURL'

export default function Students() {

    const navigate = useNavigate()
    const [users, setStudents] = useState([])

    let counter = 1; // counter variable

    useEffect(() => {

        try {
            axios.get(`${base_url}/admin/users/all`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("adminToken")
                }
            })
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
                <div className="sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm font-light">
                                <thead className="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">ID</th>
                                        <th scope="col" className="px-6 py-4">Full Name</th>
                                        <th scope="col" className="px-6 py-4">Grade</th>
                                        <th scope="col" className="px-6 py-4">Gender</th>
                                        <th scope="col" className="px-6 py-4">Test Score</th>
                                        <th scope="col" className="px-6 py-4">Starts</th>
                                        <th scope="col" className="px-4 py-4">Ends</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map(user => (
                                        user.testStat.map((test, index) => (
                                            <tr key={`${user._id}-${test._id}`} className="border-b dark:border-neutral-500">
                                                {index === 0 && (
                                                    <>
                                                        <td className="whitespace-nowrap px-6 py-4">{counter++}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{user.fullName}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{user.grade}</td>
                                                        <td className="whitespace-nowrap px-6 py-4">{user.gender}</td>
                                                    </>
                                                )}
                                                {index !== 0 && (
                                                    <>
                                                        <td className="whitespace-nowrap px-6 py-4"></td>
                                                        <td className="whitespace-nowrap px-6 py-4"></td>
                                                        <td className="whitespace-nowrap px-6 py-4"></td>
                                                        <td className="whitespace-nowrap px-6 py-4"></td>
                                                    </>
                                                )}
                                                <td className="whitespace-nowrap px-6 py-4">{test.score}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{test.testStartsTime}</td>
                                                <td className="whitespace-nowrap px-4 py-4">{test.testEndsTime}</td>
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