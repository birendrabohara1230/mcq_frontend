import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';
import { base_url } from './BaseURL';

export default function Question({ selectedTopics }) {

    console.log("selectedTopics");
    // state variables
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitClicked, setSubmitClicked] = useState(false);
    const [testStartsTime, setTestStartsTime] = useState("");
    const [loading, setLoading] = useState(true);
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
        <div className="flex justify-center shadow-lg">
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
