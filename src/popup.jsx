import "../index.css"
import React, { useState, useEffect, createContext } from "react";
import ReactDOM from "react-dom/client";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./lib/firebase";

import Header from "./components/Header";
import BeforeLogin from "./components/BeforeLogin"
import SubmitButton from "./components/SubmitButton";
import Toast from "./components/Toast";

export const UserContext = createContext();

function Popup() {
	const [user, setUser] = useState();
	const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [toast, setToast] = useState({ type: null });

	// ポップアップが表示された時に認証状態を問い合わせて、コンポーネントの表示を切り替える
	useEffect(() => {
		console.log('Popup is rendering');
		chrome.runtime.sendMessage({ type: 'auth-state'}, (res) => {
			setUser(res?.user);
			// 登録済みの場合は登録ボタンをdisabled
			if (res?.duplicate) {
				setIsSubmitDisabled(true);
			}
		});

		// 認証状態が変化した時に実行する処理を定義、この処理の中でuserの値を更新しているので認証状態が変わるとコンポーネントが再レンダリングされる
		// また戻り値として得られる関数をunsubscribeとして受け取る
		const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    })

		// コンポーネントがアンマウントされた時に、認証状態の監視を解除する
		return () => {
      unsubscribe();
    };
	}, []);

	return (
		<div className="App" style={{ height: 125, width: 300 }}>
      <UserContext.Provider value={{user, setUser}}>
			<Header />
      {!user ? <BeforeLogin /> : (
			  <div className="flex items-center flex-col">
          <div className="pt-1 pb-2">
            <Toast toast={toast} setToast={setToast}/>
          </div>

          <div className="fixed bottom-0 grid grid-cols-9 gap-x-2 w-8/9 mx-auto mt-2 mb-4">
            <div className="col-span-7 flex items-center justify-center text-center mx-auto">
              {isSubmitDisabled ? <div>閲覧中のページは登録済みです。</div> : <div>閲覧中のページを登録できます。</div>}
            </div>
            <div className="col-span-2 flex items-center justify-center mx-auto">
              {user && <SubmitButton isSubmitDisabled={isSubmitDisabled} setIsSubmitDisabled={setIsSubmitDisabled} setToast={setToast} />}
            </div>
          </div>
			  </div>
      )}
			</UserContext.Provider>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>
);
