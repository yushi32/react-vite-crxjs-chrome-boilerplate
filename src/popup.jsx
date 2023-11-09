import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function Popup() {
	const [url, setUrl] = useState('');

	const handleOnClick = () => {
		chrome.tabs.query({active: true, currentWindow: true}, (tab) => {
			console.log(tab);
			console.log(tab[0].title);
			setUrl(tab[0].url);
		});
	};

	return (
		<div className="App" style={{ height: 300, width: 300 }}>
			<button onClick={handleOnClick}>登録</button>
			<div>{url}</div>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>
);
