import { useContext } from "react";
import Logo from "../../public/logo.svg";
import LoginButton from "./LoginButton"
import LogoutButton from "./LogoutButton"
import { UserContext } from "../popup"

export default function Header() {
  const { user } = useContext(UserContext);

  const onClickHandler = () => {
    chrome.runtime.sendMessage({ type: 'link-to-Laterless' }, (res) => {
      console.log('Open Laterless with new tab');
    });
  }

  return (
    <div className="sticky top-0 h-12 w-full bg-white border-b-2">
      <div className="flex justify-between items-center h-full px-2">
        <a href='' onClick={onClickHandler}>
          <img
            src={Logo}
            alt="Logo"
            width={120}
            height={36}
          />
        </a>
        <div className="">
          {user ? <LogoutButton /> : <LoginButton />}
        </div>
      </div>
    </div>
  );
}