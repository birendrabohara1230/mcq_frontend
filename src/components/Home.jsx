import { useEffect, useState } from "react"

/* import Question Component */
import axios from "axios";

import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';
import { base_url } from './BaseURL';




export function Home() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    let testCounter = 1;
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
    const [takenTest, setTakenTest] = useState([])
    const [testStat, setTestStat] = useState([])




    useEffect(() => {
        axios.get(`${base_url}/user/1`, { withCredentials: true })
            .then(function (response) {
                setUser(response.data.user)
            })
            .catch(function (response) {
                navigate("/")
            })

        axios.get(`${base_url}/questions/taken/test`, { withCredentials: true })
            .then(function (response) {
                setTakenTest(response.data.takenTestQns)
                setTestStat(response.data.testStat)
            })
            .catch(function (error) {
                console.log(error)
                navigate("/")
            })
    }, [])


    async function handleTakeTestClick() {
        localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics))
        setIsLoading(true)
        try {
            if (selectedTopics.length >= 1) {
                await axios.post(`${base_url}/questions/selected/topics`, {
                    selectedTopics: JSON.parse(localStorage.getItem("selectedTopics"))
                }, { withCredentials: true })
                setButtonClicked(true)
            } else {
                alert(`At least one topic must be selected.`)
                return;
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
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


    async function handleLogout() {
        try {
            await axios.post(`${base_url}/user/logout`, {}, { withCredentials: true })
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="flex justify-between text-white p-3 gap-5 w-1/2 m-auto max-sm:w-full">
                <div>
                    <img
                        className="rounded-full"
                        src={user.studImage || "https://res.cloudinary.com/drmynjjhg/image/upload/v1705393573/acief5thhfdkz6sea6tf.jpg"} width={80} alt="Birendra Bohara" />
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
                            <div className="bg-blue-600 p-1 px-2 rounded-md hover:bg-blue-800">
                                <button onClick={handleTakeTestClick}>
                                    {isLoading ? 'Loading Questions...' : 'Take test'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <table className="table-auto">
                                <thead>
                                    <th>S.N</th>
                                    <th>Starts</th>
                                    <th>Ends</th>
                                    <th>Score</th>
                                </thead>
                                <tbody>
                                    {
                                        testStat.map(test => {
                                            <tr>
                                                <td>{testCounter++}</td>
                                                <td>{test.testStartsTime}</td>
                                                <td>{test.testEndsTime}</td>
                                                <td>{test.score}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                }

                <div className="flex flex-col gap-2">
                    <div>
                        <h4>Welcome,</h4>
                        <h6>
                            {
                                user.gender === "Male" ? <p>Mr. {user.fullName}</p> : <p>Mrs. {user.fullName}</p>
                            }
                        </h6>
                    </div>
                    <div>
                        <button
                            onClick={handleLogout}
                            className="p-1 bg-blue-800 rounded-md px-2 hover:bg-blue-900">
                            logout
                        </button>
                    </div>
                </div>
            </div>

            {
                buttonClicked && <Question />
            }

        </>
    )
}


// fetching question logic

function Question() {

    // state variables
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitClicked, setSubmitClicked] = useState(false);
    const [testStartsTime, setTestStartsTime] = useState("");
    const [fullMarks, setFullMarks] = useState(0)
    const [passMarks, setPassMarks] = useState(0)
    const [time, setTime] = useState(0)
    let noOfQuestions = 0;
    let counter = 1
    const navigate = useNavigate();
    let valueForOptions = 0;


    // Fetching the questions from db
    useEffect(() => {
        const today = dayjs();
        setTestStartsTime(today.format('ddd, MMM, YYYY, hh:mm:ss A'));

        axios.get(`${base_url}/questions/all/30`, {
            withCredentials: true
        })
            .then(function (response) {

                noOfQuestions = response.data.questions.length
                setFullMarks(noOfQuestions)
                setPassMarks(Math.floor(noOfQuestions * 0.4))
                setTime(Math.ceil(noOfQuestions / 2))


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
            handleSubmitButtonClick()
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
    async function handleSubmitButtonClick() {
        setSubmitClicked(true);
        const today = dayjs();
        const testEndsTime = today.format('ddd, MMM, YYYY, hh:mm:ss A');
        try {
            const response = await axios.post(`${base_url}/questions/submittedAns`, {
                selectedAnswers,
                testStartsTime,
                testEndsTime,
                selectedTopics: JSON.parse(localStorage.getItem("selectedTopics"))
            }, { withCredentials: true });
            alert(`Successfully submitted. 
Feel free to note down question that you don't know & go 
through internet, youtube, books, etc
            Or 
Consult with your teacher`)
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
    }

    // layout for the questions
    return (
        <div className="flex justify-center flex-col shadow-lg w-1/2 m-auto max-sm:w-full">
            <div className="text-white p-1 m-2 flex justify-between font-bold items-center bg-slate-600 shadow-xl rounded-md">
                <div>
                    <p>Time: {time}min</p>
                </div>
                <div>
                    <p>Attempt all Questions</p>
                </div>
                <div>
                    <p>FM:{fullMarks}</p>
                    <p>PM:{passMarks}</p>
                </div>
            </div>
            <div className="bg- p-1 m-2 shadow-xl bg-slate-600 rounded-md font-bold  text-white">
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
                        onClick={handleSubmitButtonClick}
                        disabled={submitClicked}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
