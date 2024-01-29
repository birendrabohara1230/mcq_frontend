import { useState } from "react";

export const Popup = ({ closePopup, questions }) => {
    let counter = 1;
    let valueForOptions = 0;
    return (
        <div className="fixed inset-0 m-2 sm:w-1/2 sm:m-auto p-3  flex flex-col bg-slate-800 text-white rounded-md shadow-md overflow-auto">
            <div className="flex justify-end">
                <button onClick={closePopup} className="fixed px-2 py-1 bg-red-500 rounded-md shadow-md">Close</button>
            </div>
            <div className="p-2 font-bold">
                <h3>Note:</h3>
                <p>a) Options which are in <span className="text-green-500">Green</span> are correct.</p>
                <p>b) Options which are in <span className="text-red-500">Red</span> are incorrect.</p>
            </div>
            <div>
                {questions.map((question, index) => (
                    <div key={index} id={question._id} className="text-white m-2">
                        <div className="flex gap-2 font-bold">
                            <div className="text-green-800">{counter++}.</div>
                            <div>{question.qns}</div>
                        </div>
                        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-1">
                            {question.opt.map((option, index) => (
                                <div key={index} className="">
                                    <input
                                        type="radio"
                                        name={question._id}
                                        id={valueForOptions}
                                        className="cursor-pointer"
                                        value={option}
                                        disabled={true} // Disable when submitClicked is true
                                    />
                                    <label
                                        className={`ml-2 cursor-pointer ${question.ans === option
                                            ? 'text-green-500' // Correct answer in green
                                            : question.submittedAns === option
                                                ? 'text-red-500' // Incorrect submitted answer in red
                                                : ''
                                            }`}
                                        htmlFor={valueForOptions++}
                                    >
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
