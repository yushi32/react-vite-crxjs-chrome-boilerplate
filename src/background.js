import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./lib/firebase";
import { API_URL } from "./lib/config";

const setToken = () => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({}, async (token) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const credential = GoogleAuthProvider.credential(null, token);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        resolve({ user, idToken });
      }
    });
  });
};

const signIn = async (sendResponse) => {
	const { user } = await setToken();
	sendResponse({ user: user });
};

const getBookmarks = async (sendResponse) => {
	const { idToken } = await setToken();
	const config = {
		mode: 'cors',
		headers: {
			authorization: `Bearer ${idToken}`
		},
	};
	const res = await fetch(`${API_URL}/api/v1/bookmarks`, config);
	const json = await res.json();
	sendResponse(true);
};

const createBookmark = async (sendResponse) => {
	const { idToken } = await setToken();

	const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
	chrome.tabs.sendMessage(tab.id, { type: 'get-og-image'}, async (ogResponse) => {
		const data = {
			url: tab.url,
			title: tab.title,
			thumbnail: ogResponse.ogImage,
		};
		const config = {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${idToken}`
			},
    	body: JSON.stringify(data)
		};
		const fetchResponse = await fetch(`${API_URL}/api/v1/bookmarks`, config);
		const json = await fetchResponse.json();
		if (json.bookmark) {
			sendResponse( { result: true } );
		} else {
			sendResponse( { result: false } );
		}
	})
};

const checkDuplicate = async (sendResponse, user) => {
	const { idToken } = await setToken();
	chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
		const url = tabs[0]?.url
		const config = {
			mode: 'cors',
			headers: {
				authorization: `Bearer ${idToken}`
			},
		};
		const res = await fetch(`${API_URL}/api/v1/bookmarks/check_duplicate?url=${url}`, config);
		const json = await res.json();
		console.log(res);
		sendResponse({
			user: user, 
			duplicate: json.duplicate
		});
	});
};

const openLaterlessWithNewTab = (sendResponse) => {
	chrome.tabs.create({
	  url: 'https://laterless.vercel.app/',
	  active: true,
	});
	sendResponse();
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'sign-in':
      signIn(sendResponse);
			return true;

		case 'sign-out':
			signOut(auth);
			return;
		
		case 'fetch':
			getBookmarks(sendResponse);
			return true;

		case 'create':
			createBookmark(sendResponse);
			return true;
		
		case 'already-saved?':
			checkDuplicate(sendResponse);
			return(true);

		case 'link-to-Laterless':
			openLaterlessWithNewTab(sendResponse);
			return(true)
		
    default:
      console.log('unknown message type', message.type);
			sendResponse();
			return true;
  }
});

let currentUser;

const checkAuthState = (message, _sender, sendResponse) => { // マウントされた時にポップアップのuseEffectからメッセージが飛んでくる
	switch (message.type) {
		case 'auth-state':
			// ログイン状態であればユーザーを、ログアウト状態であれば空のオブジェクトを返す
			sendResponse({ user: currentUser || {} })
			return true;
	}
};

// onAuthStateChangedを起動してユーザーの認証状態を監視する、userは多分ログイン中のユーザーが渡ってくる
// ユーザーの認証状態が変わるとコールバック関数が実行される
// onAuthStateChangedはコンポーネントがマウント（ポップアップが表示）される度に呼び出される
onAuthStateChanged(auth, (user) => {
	currentUser = user;
	// ポップアップ側からのサインイン状態取得リクエストを受け付ける
	chrome.runtime.onMessage.addListener(checkAuthState);
	if (!user) {
		chrome.runtime.onMessage.removeListener(checkAuthState);
	}
});

export {};
