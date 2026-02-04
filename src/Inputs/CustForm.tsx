import { useState } from 'react';
import './Input styles/maps-forms.css';

function CustForm({ custData }) {
	const [custFormData, setCustFormData] = useState({
		name: '',
		email: '',
		phone: ''
	});

    const handleSubmit = (e) => {
    	e.preventDefault();
    	custData(custFormData);
        //clear form
    	setCustFormData({
    		name: '',
			email: '',
			phone: ''
    	});
    };

    const handleChange = (e) => {
    	setCustFormData({
    		...custFormData, 
    		[e.target.name]: e.target.value
    	});
    };



	return (
		<div id="cust-form-cont">
			<label className="input-form">Full Name
				<input name="name"
					value={custFormData.name}
					onChange={handleChange}
					required type="text"
					placeholder="First & Last Name"
				/>
			</label>
			<label className="input-form">Email
				<input name="email"
					value={custFormData.email}
					onChange={handleChange}
					required type="email"
					placeholder="Enter your Email address"
				/>
			</label>
			<label className="input-form">Phone Number
				<input name="phone"
					value={custFormData.phone}
					onChange={handleChange}
					required type="text"
					placeholder="Enter your Phone Number"
				/>
			</label>
			<button onClick={handleSubmit}>
				Get My Estimate
			</button>
		</div>
		);
}

export default CustForm;


