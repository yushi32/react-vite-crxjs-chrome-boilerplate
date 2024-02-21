import React, { useState, useEffect } from 'react';

export default function Toast({ toast, setToast }) {
  const [message, setMessage] = useState('');
  const [bgColor, setBgColor] = useState('bg-white');

  useEffect(() => {
		if (toast.type) {
      switch (toast.type) {
        case 'success':
          setMessage('Successfully created!!!');
          setBgColor('bg-sky-500');
          break;
        case 'failure':
          setMessage('Sorry, failed...');
          setBgColor('bg-orange-500');
          break;
        default:
          setMessage('Sorry, failed...');
          setBgColor('bg-orange-500');
          break;
      }

			const timeoutId = setTimeout(() => {
				setToast({ type: null });
        setMessage('')
        setBgColor('white');
			}, 3000);
	
			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [toast]);

  if (message === '') {
    return null
  }

  return (
    <>
			<div className={`${bgColor} px-3 py-1 w-full`}
        style={{
          display: toast.type ? 'block' : 'none',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        {message}
      </div>
    </>
  );
};