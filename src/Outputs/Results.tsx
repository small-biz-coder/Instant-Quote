import { useState, useEffect } from 'react';
import './results.css';


function Results({ estimatePrice, yardData, custInfo, onSendEmail }) {

	const [fertPrice, setFertPrice] = useState(0);
	const [mowingPrice, setMowingPrice] = useState(0);
    const [status, setStatus] = useState('');
    const [emailSent, setEmailSent] = useState(false);

	useEffect(() => {
		const mowing = estimatePrice * 4;
		setMowingPrice(mowing);
		
		const fert = yardData * 0.25 + mowing;
		setFertPrice(fert);

		// Send email only once when component mounts and we have all data
		if (!emailSent && custInfo.email && estimatePrice && yardData) {
			const message = {
				email: custInfo.email,
				mowingPrice: mowing,
				fertilizerPrice: fert
			};

			sendEmail(message);
			setEmailSent(true); // Prevent sending again
		}
	}, [estimatePrice, yardData, custInfo.email, emailSent]); 

	const sendEmail = async (message) => {
		try {
			const response = await fetch('http://localhost:3005/api/send-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message })
			});

			if (response.ok) {
				setStatus('has been sent to your inbox!');
			} else {
				setStatus('failed to send to your inbox');
			}
		} catch (error) {
			console.error('Email error:', error);
			setStatus('encountered an error sending the email');
		}
	};



	return (
		<div className="results-cont">
			<h2>Your Estimate Has Been Submitted</h2>
			<p>You estimate {status}.<br/>
				In the meantime contact us with any questions you might have.</p>
				<strong>Your current Estimate for mowing once a week: ${mowingPrice} per month<br /><br />
				For mowing and fertilizing once a month: ${fertPrice} per month</strong>
				<button><a href="mailto:andrew@harvestclicks.com">Send us an Email</a></button>
		</div>
		)
};

export default Results;