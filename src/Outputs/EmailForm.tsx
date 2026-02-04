import { useState } from 'react';

function EmailForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message })
      });
      
      if (response.ok) {
        setStatus('Email sent successfully!');
      } else {
        setStatus('Failed to send email');
      }
    } catch (error) {
      setStatus('Error sending email');
    }
  };

  return (null
    // <form onSubmit={sendEmail}>
    //   <input 
    //     type="email" 
    //     value={email} 
    //     onChange={(e) => setEmail(e.target.value)}
    //     placeholder="Email address"
    //   />
    //   <textarea 
    //     value={message} 
    //     onChange={(e) => setMessage(e.target.value)}
    //     placeholder="Your message"
    //   />
    //   <button type="submit">Send Email</button>
    //   {status && <p>{status}</p>}
    // </form>
  );



export default EmailForm;



}