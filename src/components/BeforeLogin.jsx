export default function BeforeLogin() {
  const linkToLaterless = () => {
    chrome.runtime.sendMessage({ type: 'link-to-Laterless' }, (res) => {
      console.log('open Laterless with new tab');
    });
  }
  return (
    <div className="flex items-center flex-col justify-evenly text-center w-5/6 mx-auto p-2">
      <div>
        Laterless はブックマークを効率的に管理・消化するためのアプリです。
      </div>
      <div>
        この拡張機能のご利用には Laterless へのご登録が必要です。
      </div>
      <div>
        <a href='' onClick={linkToLaterless} className="text-emerald-400 hover:text-emerald-600">
          こちら
        </a>
        からご登録ください。
      </div>
    </div>
  );
}