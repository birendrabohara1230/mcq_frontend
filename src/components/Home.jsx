import { useEffect, useState } from "react"

/* import Question Component */
import axios from "axios";

import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';
import { base_url } from './BaseURL';



export function Home() {
    const navigate = useNavigate();
    const topics = {
        a: "Computer basics",
        b: "Number system",
        c: "Qbasic basics",
        d: "Modular programming & Array in Qbasic",
        e: "File handling",
        f: "Introduction to C programming"
    }

    const [user, setUser] = useState({})
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(false);




    useEffect(() => {
        axios.get(`${base_url}/user/1`)
            .then(function (response) {
                setUser(response.data.user)
            }, { withCredentials: true })
            .catch(function (response) {
                navigate("/")
            })
    }, [])


    async function handleClick() {
        if (selectedTopics.length >= 1) {
            await axios.post(`${base_url}/questions/selected/topics`, {
                selectedTopics,
            }, { withCredentials: true })
            setButtonClicked(true)
        } else {
            alert(`At least one topic.`)
            return;
        }
    }

    function handleCheckboxChange(key) {
        // Toggle the checkbox value in the array
        setSelectedTopics((prevSelectedTopics) => {
            const index = prevSelectedTopics.indexOf(topics[key]);
            if (index !== -1) {
                // If already selected, remove it
                return [...prevSelectedTopics.slice(0, index), ...prevSelectedTopics.slice(index + 1)];
            } else {
                // If not selected, add it
                return [...prevSelectedTopics, topics[key]];
            }
        });
    }

    return (
        <>
            <div className="flex justify-between text-white p-3 gap-5 w-1/2 m-auto max-sm:w-full">
                <div>
                    <img
                        className="rounded-full"
                        src="https://res.cloudinary.com/drmynjjhg/image/upload/v1705393573/acief5thhfdkz6sea6tf.jpg" width={80} alt="Birendra Bohara" />
                </div>
                {
                    buttonClicked ? "" : <div>
                        <div className="flex gap-4 flex-col items-center  text-white">
                            <div className="p-1 text-red-600 font-bold">
                                <p>Choose the topics </p>
                            </div>
                            <div className="grid grid-cols-2  max-sm:grid-cols-1 gap-1" >
                                {Object.keys(topics).map((key) => (
                                    <div key={key}>
                                        <input
                                            type="checkbox"
                                            id={key}
                                            onChange={() => handleCheckboxChange(key)}
                                            checked={selectedTopics.includes(topics[key])}
                                        />
                                        <label className="ml-3" htmlFor={key}>
                                            {topics[key]}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-blue-600 p-1 px-2 rounded-md hover:bg-blue-700">
                                <button onClick={handleClick}>
                                    Take test
                                </button>
                            </div>
                        </div>
                    </div>
                }

                <div>
                    <h4>Welcome,</h4>
                    <h6>
                        {
                            user.gender === "Male" ? <p>Mr. {user.fullName}</p> : <p>Mrs. {user.fullName}</p>
                        }
                    </h6>
                </div>
            </div>

            {
                buttonClicked && <Question topics={selectedTopics} />
            }

        </>
    )
}


export function Question() {

    // state variables
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitClicked, setSubmitClicked] = useState(false);
    const [testStartsTime, setTestStartsTime] = useState("");
    const navigate = useNavigate();
    let counter = 1;
    let valueForOptions = 0;

    // Fetching the questions from db
    useEffect(() => {
        const today = dayjs();
        setTestStartsTime(today.format('ddd, MMM, YYYY, hh:mm:ss A'));

        axios.get(`${base_url}/questions/all/30`, {
            withCredentials: true
        })
            .then(function (response) {
                setQuestions(response.data.questions);
            })
            .catch(function (error) {
                console.log(error.message);
                navigate("/");
            })
            .finally(function () {
                setLoading(false); // Set loading to false regardless of success or error
            });

        setTimeout(() => {
            setSubmitClicked(true);
        }, 900000);
    }, []);

    // collecting the selected answers along with their questions Unique Id
    function handleChange(e, questionId) {
        const selectedOption = e.target.value;
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: selectedOption,
        }));
    }

    // send uses selected answer along with questions id 
    // test start time 
    // test end time
    async function handleClick() {
        setSubmitClicked(true);
        const today = dayjs();
        const testEndsTime = today.format('ddd, MMM, YYYY, hh:mm:ss A');

        try {
            const response = await axios.post(`${base_url}/questions/submittedAns`, {
                selectedAnswers,
                testStartsTime,
                testEndsTime,
            }, { withCredentials: true, });
            // Handle response as needed
        } catch (error) {
            console.log(error);
        }
    }

    // layout for the questions
    return (
        <div className="flex justify-center flex-col shadow-lg w-1/2 m-auto max-sm:w-full">
            <div className="text-white p-1 m-2 flex justify-between items-center bg-gradient-to-br from-red-700 to-indigo-600 shadow-xl rounded-md">
                <div>
                    <p>Time: 15min</p>
                </div>
                <div>
                    <p>Attempt all Questions</p>
                </div>
                <div>
                    <p>FM:30</p>
                    <p>PM:12</p>
                </div>
            </div>
            <div className="bg- p-1 m-2 shadow-xl bg-gradient-to-br from-lime-500 to-indigo-600 rounded-md text-white">
                <p><span className="text-red-900 font-bold text-xl">Note:</span></p>
                <p><span className="text-red-800 font-bold">a)</span> Before 15 minutes you have to submit answer, otherwise automatically solved questions will be submitted.</p>
                <p><span className="text-red-800 font-bold">b)</span> There are some questions that might you don't know, so don't feel overwhelming.</p>
            </div>
            <div className="bg-slate-800 p-1 m-2 shadow-xl rounded-md">
                {
                    questions.map((question, index) => (
                        <div key={index} id={question._id} className="text-white m-2">
                            <div className="flex gap-2 font-bold">
                                <div className="text-green-800">{counter++}.</div>
                                <div>{question.qns}</div>
                            </div>
                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-1">
                                {question.opt.map((option, index) => (
                                    <div key={index} className="">
                                        <input type="radio" name={question._id} id={valueForOptions}
                                            className="cursor-pointer"
                                            value={option}
                                            onChange={(e) => handleChange(e, question._id)}
                                            disabled={submitClicked} // Disable when submitClicked is true
                                        />
                                        <label className="ml-2 cursor-pointer" htmlFor={valueForOptions++}>{option}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                }
                <div className="mt-4 text-center">
                    <button
                        className="text-white hover:bg-blue-950 w-40 p-3 rounded-lg bg-blue-800"
                        onClick={handleClick}
                        disabled={submitClicked}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
