import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../../chrome-extension/global.service/dexie.service';
import { MdOpenInNew } from 'react-icons/md';

const openNewTab = () => {
  console.log({ url: chrome.runtime.getURL('newtab.html') });
  chrome.tabs.create({ url: chrome.runtime.getURL('newtab/index.html') });
};

type ListenToShortcutProps = {
  shortcut: string;
  arrayShortcut: string[];
};

export const ListenToShortcut = ({ shortcut, arrayShortcut }: ListenToShortcutProps) => {
  const shorcutsLen = useLiveQuery(() => db.shortcuts.toArray())?.length;
  const haveSavedShortcut: boolean = shorcutsLen && shorcutsLen >= 2 ? true : false;

  return (
    <div className="flex justify-center items-center bg-[#f0f0f0]">
      <div className="bg-white rounded-lg shadow-md p-6 w-96">
        <button
          disabled={!haveSavedShortcut}
          onClick={openNewTab}
          className="w-full bg-[#333] text-white py-3 rounded-md mb-6 flex items-center justify-center">
          <span className="mr-1">Practice</span> <MdOpenInNew />
        </button>
        <div className="w-full h-[1px] bg-gray-300 my-10"></div>
        <h2 className="text-xl font-semibold mb-4 text-center">Save a shortcut</h2>
        <div className="bg-[#f5f5f5] rounded-md p-6 text-center">
          <div className="flex flex-row items-end h-16 ms-2 justify-center">
            {shortcut == '' && (
              <div className="bg-black text-white text-2xl font-semibold rounded-md w-16 h-1 flex items-center justify-center mx-2 mb-4 animate-blink"></div>
            )}
            {shortcut !== '' &&
              arrayShortcut.map((keystroke, i) => (
                <div
                  key={i}
                  className="bg-black text-white text-2xl font-semibold rounded-md w-16 h-16 flex items-center justify-center mx-2 mb-4">
                  {keystroke}
                </div>
              ))}
          </div>
          <p className="text-gray-500">
            Just press the keys on your keyboard
            <br />
            as if you were executing the shortcut
          </p>
        </div>
      </div>
    </div>
  );
};
