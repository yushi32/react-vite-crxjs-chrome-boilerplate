import Button from "./Button";

export default function LogoutButton() {
  const logout = () => {
		chrome.runtime.sendMessage({ type: 'sign-out' });
	};

  return (
    <Button text='ログアウト' onClickHandler={logout} />
  );
}