import { useState } from 'react';
import './Input styles/maps-forms.css';

interface CustFormData {
	name: string;
	email: string;
	phone: string;
}

interface CustFormProps {
	custData: (data: CustFormData) => void;
}

function CustForm({ custData }: CustFormProps) {
	const [custFormData, setCustFormData] = useState<CustFormData>({
		name: '',
		email: '',
		phone: ''
	});

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    	event.preventDefault();
    	custData(custFormData);
        //clear form
    	setCustFormData({
    		name: '',
			email: '',
			phone: ''
    	});
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void  => {
    	const { name, value } = event.target;
    	setCustFormData({
    		...custFormData, 
    		[name]: value
    	});
    };



	return (
		<form id="cust-form-cont" onSubmit={handleSubmit}>
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
			<button type="submit">
				Get My Estimate
			</button>
		</form>
		);
}

export default CustForm;


