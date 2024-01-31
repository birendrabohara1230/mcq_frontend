import { useEffect, useState } from "react"

/* import Question Component */
import axios from "axios";

import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';
import { base_url } from './BaseURL';
import { Popup } from "./Popup";




export function Home() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [difference, setDifference] = useState(0)
    const [testSet, setTestSet] = useState(0)
    let testCounter = 1;
    let takenTestCounter = 0
    let totalTakenTest = 0
    let totalStoredTest = 0
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
    const [testExists, setTestExists] = useState(false)

    //popup logic
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = (e) => {
        setTestSet(parseInt(e.target.name))
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`${base_url}/user/1`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });

                setUser(userResponse.data.user);

                const testResponse = await axios.get(`${base_url}/questions/taken/test`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });

                setTakenTest(testResponse.data.takenTestQns);
                setTestStat(testResponse.data.testStat);

                if (testResponse.data.testStat.length > 0) {
                    setTestExists(true);
                }

                totalTakenTest = testResponse.data.testStat.length;
                totalStoredTest = testResponse.data.takenTestQns.length;
                const difference = totalTakenTest - totalStoredTest;
                setDifference(difference)
                setDataLoaded(true);
            } catch (error) {
                console.log(error);
                navigate("/");
            }
        };

        fetchData();
    }, []);



    async function handleTakeTestClick() {
        localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics))
        setIsLoading(true)
        try {
            if (selectedTopics.length >= 1) {
                await axios.post(`${base_url}/questions/selected/topics`, {
                    selectedTopics: JSON.parse(localStorage.getItem("selectedTopics"))
                }, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                })
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
            localStorage.removeItem("token")
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }


    if (!dataLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="animate-spin rounded-full border-t-4 border-white border-opacity-25 h-12 w-12"></div>
            </div>
        )
    }
    return (
        <>
            <div className="flex justify-between text-white p-3 gap-5 w-1/2 m-auto max-sm:w-full">
                <div>
                    <img
                        className="rounded-full"
                        src={user.studImage || "https://res.cloudinary.com/drmynjjhg/image/upload/v1705393573/acief5thhfdkz6sea6tf.jpg"}
                        width={80} alt="Birendra Bohara"
                    />
                </div>
                {
                    buttonClicked ? "" :
                        <div>
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

            {/* Questions logic implemented here */}

            {
                buttonClicked && <Question />
            }
            {isPopupOpen && (
                <div>
                    <Popup closePopup={closePopup} questions={takenTest[testSet]} />
                </div>
            )}


            <div className="flex justify-center text-white p-3 gap-5 w-1/2 m-auto max-sm:w-full rounded-md overflow-hidden">
                {
                    testExists &&
                    <div className="mt-5 m-2">
                        <div className="p-2 text-center rounded-md mb-1">Results of taken test</div>
                        <div className="overflow-hidden">
                            <table className="w-full rounded-md text-sm text-left overflow-hidden  rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            S.N
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Starts
                                        </th>
                                        {/* <th scope="col" className="px-6 py-3">
                                            Ends
                                        </th> */}
                                        <th scope="col" className="px-3 py-3">
                                            Score
                                        </th>
                                        <th scope="col" className="px-6 py-3">

                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        testStat.map((test, index) => (
                                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {testCounter})
                                                </th>
                                                <td className="px-6 py-4">
                                                    {test.testStartsTime}
                                                </td>
                                                {/* <td className="px-6 py-4">
                                                    {test.testEndsTime}
                                                </td> */}
                                                <td className="px-3 py-4">
                                                    {test.score}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {

                                                        testCounter++ > difference ?
                                                            <button
                                                                name={takenTestCounter++}
                                                                className="px-2 py-1 bg-pink-300 rounded-md shadow-sm text-black"
                                                                onClick={
                                                                    (e) => {
                                                                        openPopup(e)
                                                                    }
                                                                }>
                                                                Result
                                                            </button>
                                                            : ""

                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
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
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
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

        const timeoutId = setTimeout(() => {
            handleSubmitButtonClick();
        }, 900000);

        // Cleanup function to clear the timeout when the component is unmounted
        return () => clearTimeout(timeoutId);
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
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
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
            <div className="p-1 m-2 shadow-xl bg-slate-600 rounded-md font-bold  text-white">
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
