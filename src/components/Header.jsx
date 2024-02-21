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
        <a href='' onClick={onClickHandler} className="flex items-center justify-between bg-emerald-400 p-1">
          <img
            src={Logo}
            alt="Logo"
            width={30}
            height={30}
          />
          <span className="text-xl">Laterless</span>
        </a>
        <div className="">
          {user ? <LogoutButton /> : <LoginButton />}
        </div>
      </div>
    </div>
  );
}