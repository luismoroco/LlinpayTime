import React, { useState, useEffect } from 'react';
import Axios from "axios";
import { EyeIcon } from '@heroicons/react/24/solid'

const Modal = ({setMainRepo, modal, setModal}) => {
    const [repo, setRepo] = useState("");
    const [volume, setVolume] = useState([]);

    useEffect(() => { 
        const fetch = async() => { 
            const data = await Axios.get(
                `http://127.0.0.1:5000/volumes`
            ); 

            setVolume(data.data);
        } 
            
        fetch();
    }, []);  

    const handleChangeRepo = (e) => { 
        setRepo(e.target.value);
        setMainRepo(e.target.value);
    }

    const closeModal = () => {   
        setModal(false);
    };  
 
    return (
        <>
            {modal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-gray-500 opacity-95"></div>
                    <div className="bg-white p-8 rounded-lg shadow-2xl z-10 w-[30%] text-center">
                        <h2 className="text-4xl font-extrabold mb-4">LLinpayTime</h2>
                        <p className="font-light text-md p-2"> Select a repository </p>

                        <div className='w-full p-3'>
                            <select 
                                value={repo}
                                onChange={handleChangeRepo}
                                className="block w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                            >
                                {volume && volume.map((option) => (
                                    <option key={option.name} value={option.name}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                            onClick={closeModal}
                        >
                            <EyeIcon className='w-7 h-7' />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;