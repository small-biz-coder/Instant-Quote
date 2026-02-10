import { useState, useEffect } from 'react';
import './results.css';

interface CustInfo {
  name: string;
  email: string;
  phone: string;
}

interface EmailMessage {
	email: string;
	mowingPrice: number;
	fertilizerPrice: number;
}

interface ResultsProps {
	estimatePrice: number;
	yardData: number;
	custInfo: CustInfo;
}


function Results({ estimatePrice, yardData, custInfo }: ResultsProps) {

	const [fertPrice, setFertPrice] = useState<number>(0);
	const [mowingPrice, setMowingPrice] = useState<number>(0);
    const [status, setStatus] = useState<string>('');
    const [emailSent, setEmailSent] = useState<boolean>(false);

	useEffect(() => {
		const mowing = estimatePrice * 4;
		setMowingPrice(mowing);
		
		const fert = yardData * 0.25 + mowing;
		setFertPrice(fert);

		// Send email only once when component mounts and we have all data
		if (!emailSent && custInfo.email && estimatePrice && yardData) {
			const message: EmailMessage = {
				email: custInfo.email,
				mowingPrice: mowing,
				fertilizerPrice: fert
			};

			sendEmail(message);
			setEmailSent(true); // Prevent sending again
		}
	}, [estimatePrice, yardData, custInfo.email, emailSent]); 

	const sendEmail = async (message: EmailMessage): Promise<void> => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL_PROD}/api/send-email`, {
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
				<strong>Your current Estimate for mowing once a week: ${mowingPrice.toFixed(2)} per month<br /><br />
				For mowing and fertilizing once a month: ${fertPrice.toFixed(2)} per month</strong>
				<button><a href="mailto:andrew@harvestclicks.com">Send us an Email</a></button>
		</div>
		)
};

export default Results;


