import { useContext } from "react";
import { UserContext } from "../popup";
import Button from "./Button";

export default function LoginButton() {
  const { setUser } = useContext(UserContext);

  const signInWithChromeUser = () => {
		chrome.runtime.sendMessage({ type: 'sign-in' }, (res) => {
      setUser(res.user);
		});
	};

  return (
    <Button text='ログイン' onClickHandler={signInWithChromeUser} />
  );
}