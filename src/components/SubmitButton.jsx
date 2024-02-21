import React, { useState, useEffect } from "react";

export default function SubmitButton({ isSubmitDisabled, setIsSubmitDisabled, setToast }) {
  const [text, setText] = useState('save');

  const createBookmark = () => {
		chrome.runtime.sendMessage({ type: 'create' }, (res) => {
      setText('saved');
      setIsSubmitDisabled(true);
			if (res.result) {
        setToast({ type: 'success' })
      } else {
        setToast({ type: 'failure' })
      }
		});
	}

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'already-saved?'}, (res) => {
      if (res?.duplicate) {
        setIsSubmitDisabled(true);
        setText('saved')
      }
    })
  }, []);

  return (
    <button
      onClick={createBookmark}
      disabled={isSubmitDisabled}
      className={`rounded-lg p-1 transform ${
        isSubmitDisabled
          ? 'bg-slate-400'
          : 'bg-slate-200 hover:bg-slate-300 hover:scale-95'
      }`}
    >
      {text}
    </button>
  );
};