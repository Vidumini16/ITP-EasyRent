import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ComplainsForm from '../Reviews and rating management/ComplainsForm';

const RenterHome = () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const renterId = user ? user._id : null;
    const [details, setDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('model');
    const [likedItems, setLikedItems] = useState([]);
    const [popup, setPopup] = useState(null);
    const [complains, setComplains] = useState([]);
    const userid = localStorage.getItem('id');

    useEffect(() => {
        axios
            .get(`http://localhost:5556/Complains`)
            .then((response) => {
                setComplains(response.data); // Assuming response.data contains an array of complaints
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5556/api/vehicle/')
            .then(response => {
                console.log('Response data:', response.data);
                setDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching Vehicles:', error);
            });
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterBy(event.target.value);
    };

    const handleLike = async (vehicleId) => {
        try {
            const response = await axios.patch(`http://localhost:5556/api/renter/${renterId}/${vehicleId}`);
            console.log(response.data.message);
            if (likedItems.includes(vehicleId)) {
                setLikedItems(likedItems.filter(item => item !== vehicleId));
            } else {
                setLikedItems([...likedItems, vehicleId]);
            }
        } catch (error) {
            console.error('Error toggling vehicle like:', error);
        }
    };

    const filteredDetails = details.filter(detail => {
        if (filterBy === "totalSeats") {
            return detail[filterBy] === parseInt(searchTerm);
        } else {
            return detail[filterBy].toLowerCase().includes(searchTerm.toLowerCase());
        }
    });
    

    const handleClickPopup = (id) => {
        setPopup(id);
    }

    const getReviewValue = (vehicleId) => {
        const review = complains.find(complaint => complaint.vehicle_id === vehicleId);
        return review ? review.rating : 'No Reviews';
    };

    return (
        <div>
            <header className="border-b md:flex md:items-center md:justify-between p-4 pb-0 shadow-lg md:pb-4">
                <form className="flex items-center w-full md:w-auto">
                    <div className="mr-4">
                        <label htmlFor="filter-select" className="block text-gray-700">Filter By:</label>
                        <select id="filter-select" className="bg-gray-200 border border-gray-300 py-2 px-4 rounded-md focus:outline-none focus:bg-white focus:border-gray-500" value={filterBy} onChange={handleFilterChange}>
                            <option value="model">Model</option>
                            <option value="brand">Brand</option>
                            <option value="transmission">Transmission</option>
                           
                            <option value="totalSeats">Total Seats</option>
                        </select>
                    </div>
                    <div>
                        <label className="hidden" htmlFor="search-form">Search</label>
                        <input
                            className="bg-grey-lightest border-2 focus:border-orange p-2 rounded-lg shadow-inner"
                            placeholder={`Search by ${filterBy}`}
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <button className="hidden">Submit</button>
                    </div>
                </form>
            </header>
            <main className="main">
                <div className="container bg-white">
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDetails.map((detail, index) => (
                            <div key={index} className="card_ui bg-gray-200 m-4 rounded-lg p-6 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <a href="#" className="border-2 border-gray-200 rounded-lg p-1 flex items-center">
                                            <i className="fas fa-star text-yellow-500"></i>
                                            <span className="text-gray-700">{getReviewValue(detail._id)}</span>
                                            <span className="text-gray-600">(109)</span>
                                        </a>
                                        <div className="bg-green-100 rounded-lg p-1">
                                            <span className="text-green-600">Available</span>
                                            <button className='ml-20' onClick={() => { handleClickPopup(detail) }}>Add Reviews</button>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="button_like" onClick={() => handleLike(detail._id)} data-vehicle-id={detail._id}>
                                            <i className={`far fa-heart ${likedItems.includes(detail._id) ? 'text-red-500' : ''}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center py-8">
                                    <Link to={`/booking/create/${detail._id}`} className="car_img_content_link">
                                        <figure className="car_img_content">
                                            <img src="https://raw.githubusercontent.com/emmywebgiart/card_ui_vehicle_rent/master/img/ford_focus.png" alt="Ford Focus" className="w-4/5 md:w-full transition duration-300 ease-in-out transform hover:scale-110" />
                                        </figure>
                                    </Link>
                                </div>
                                <div>
                                    <p className="car_name text-gray-600">{detail.model}</p>
                                    <div className="flex justify-between items-center">
                                        <a href="#" className="car_model_link">
                                            <h2 className="car_model text-lg md:text-xl lg:text-2xl font-bold text-gray-800 truncate" title="FOCUS">{detail.brand}</h2>
                                        </a>
                                        <p className="car_price text-gray-700">Rs.{detail.price} <span className="car_price_time">/per Week</span></p>
                                    </div>
                                </div>
                                <div className="border-t-2 border-gray-200 mt-6 pt-6">
                                    <ul className="grid grid-cols-3 gap-2">
                                        <li className="flex items-center gap-2">
                                            <i className="fas fa-sliders-h text-gray-600"></i>
                                            <span className="text-gray-600 truncate" title="Manual">{detail.transmission}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="fas fa-tachometer-alt text-gray-600"></i>
                                            <span className="text-gray-600 truncate" title="Kilometraje ilimitado">{detail.owner}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <i className="fas fa-user text-gray-600"></i>
                                            <span className="text-gray-600">{detail.totalSeats}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </main>

            {popup && (
                <div className="popupContainer">
                    <ComplainsForm data={popup} close={setPopup} />
                </div>
            )}
        </div>
    );
};

export default RenterHome;
