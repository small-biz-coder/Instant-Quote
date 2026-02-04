import { useState } from 'react';
import './Input styles/maps-forms.css';


function YardForm ({ appData }) {
	const [yardFormData, setYardFormData] = useState({
		trees: '',
		fence: '',
		grassCondition: ''
	});

    const handleSubmit = (e) => {
    	e.preventDefault();
    	appData(yardFormData);
        //clear form
    	setYardFormData({
    		trees: '',
			fence: '',
			grassCondition: ''
    	});
    };

    const handleChange = (e) => {
    	setYardFormData({
    		...yardFormData, 
    		[e.target.name]: e.target.value
    	});
    };

	return (
		<div id="yard-form-cont">
			<form onSubmit={handleSubmit}
			 className="yard-form-cont">
				<label className="input-form">Trees
					<select name="trees"
						value={yardFormData.trees}
						onChange={handleChange}
						required>
						<option value="">Select</option>
						<option value="0">0</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5 or more">5 or more</option>
					</select>
				</label>
				<label className="input-form">Fence
					<select name="fence"
						value={yardFormData.fence}
						onChange={handleChange}
						required>
						<option value="">
							Choose
						</option>
						<option value="no">No</option>
						<option value="yes">Yes</option>
					</select>
				</label>
				<label className="input-form">Current Grass Condition
					<select name="grassCondition"
						value={yardFormData.grassCondition}
						onChange={handleChange}
						required>
						<option value="">
							Select
						</option>
						<option value="average">Average</option>
						<option value="poor">Poor</option>
						<option value="good">Good, could me better</option>
						<option value="excellent">Excellent</option>
					</select>
				</label>
				<button
					value="Submit"
				>
					Final Step
				</button>
		    </form>
		</div>
		)
}

export default YardForm;


