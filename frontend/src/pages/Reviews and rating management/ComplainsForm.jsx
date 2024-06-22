import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ComplainsForm = ({data, close}) => {

    const id = localStorage.getItem('id');
    
    const [formData, setFormData] = useState({
        id: id,
        vehicle_id: data._id,
        Driver_description: "",
        Vehicle_description: "",
        rating: "",
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();	

    const handleButtonClick = () => {
        navigate('/reviews');
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        // Validate the field
        const regex = /^[a-zA-Z0-9\s]*$/;  // Regular expression to allow only letters and spaces
        if (!regex.test(value)) {
            setErrors({ ...errors, [id]: "Special characters are not allowed" });
        } else {
            setErrors({ ...errors, [id]: "" });
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check if there are any errors
        const hasErrors = Object.values(errors).some((error) => error !== "");
        if (hasErrors) {
            return;
        }
        console.log(formData);
        // Send form data to the server
        axios
            .post("http://localhost:5556/complains", formData)
            .then((response) => {
                console.log(response.data);
                alert('Thanks for your Reviews...!')
                handleClose();
            })
            .catch((error) => {
                console.error(error);
            });

        // Clear the form after submit
        setFormData({
            id: id,
            vehicle_id: "",
            Driver_description: "",
            Vehicle_description: "",
            rating: "",
        });
    };

    const handleClose = () => {
        close(null);
    }

    return (
        <div>
            
            <div className="flex flex-col justify-between min-h-screen">
                <div className="flex justify-center">
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-9 pt-10 pb-8 mt-10">
                        <center><b>Give your Ratings & Reviews......</b></center>
                        <br />
                        {/* Rating buttons */}
                        <div className="flex items-center mb-4">
                            {[...Array(5)].map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: index + 1 })}
                                    className={`text-3xl mx-1 focus:outline-none ${
                                        index + 1 <= formData.rating ? 'text-yellow-500' : 'text-gray-300'
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                           <div className="ml-10 mt-2">
                                {formData.rating === ''? 'Please rate' :
                                    (() => {
                                        switch (formData.rating) {
                                            case 1:
                                                return 'Bad';
                                            case 2:
                                                return 'Average';
                                            case 3:
                                                return 'Good';
                                            case 4:
                                                return 'Best';
                                            case 5:
                                                return 'Excellent';
                                            default:
                                                return '';
                                        }
                                    })()
                                }
                            </div>

                        </div>

                        {/* Vehicle ID input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicle_id">Vehicle Id</label>
                            <input
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.vehicle_id ? 'border-red-500' : ''}`}
                                id="vehicle_id"
                                type="text"
                                placeholder="Vehicle ID"
                                name="vehicle_id"
                                value={data._id  || ""}
                                onChange={handleChange}
                                required
                            />
                            {errors.vehicle_id && <p className="text-red-500 text-xs italic">{errors.vehicle_id}</p>}
                        </div>
                       

                        {/* Driver Description input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Driver_description">Review for Driver</label>
                            <input
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.Driver_description ? 'border-red-500' : ''}`}
                                id="Driver_description"
                                type="text"
                                placeholder="Review for driver"
                                name="Driver_description"
                                value={formData.Driver_description || ""}
                                onChange={handleChange}
                                required
                            />
                            {errors.Driver_description && <p className="text-red-500 text-xs italic">{errors.Driver_description}</p>}
                        </div>

                        {/* Vehicle Description input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Vehicle_description">Review for Vehicle</label>
                            <input
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.Vehicle_description ? 'border-red-500' : ''}`}
                                id="Vehicle_description"
                                type="text"
                                placeholder="Review for Vehicle"
                                name="Vehicle_description"
                                value={formData.Vehicle_description || ""}
                                onChange={handleChange}
                                required
                            />
                            {errors.Vehicle_description && <p className="text-red-500 text-xs italic">{errors.Vehicle_description}</p>}
                        </div>

                        {/* Submit button */}
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                            type="submit"
                        >
                            Save
                        </button>
                        <button
                            className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                            type="button" onClick={handleClose}
                        >
                            close
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                            type="button"
                            onClick={handleButtonClick}
                        >
                            View your complains
                        </button>
                    </form>
                </div>
            </div>
            
        </div>
    
    );
};

export default ComplainsForm;
    