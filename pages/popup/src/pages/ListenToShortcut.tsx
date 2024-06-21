import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../../chrome-extension/global.service/dexie.service';

const openNewTab = () => {
  console.log({ url: chrome.runtime.getURL('newtab.html') });
  chrome.tabs.create({ url: chrome.runtime.getURL('newtab/index.html') });
};

type SaveShortcutProps = {
  shortcut: string;
};

export const ListenToShortcut = ({ shortcut }: SaveShortcutProps) => {
  const shorcutsLen = useLiveQuery(() => db.shortcuts.toArray())?.length;
  const haveSavedShortcut: boolean = shorcutsLen && shorcutsLen >= 2 ? true : false;

  return (
    <section className="flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white border border-gray-300 rounded-lg shadow-md">
        <button
          disabled={!haveSavedShortcut}
          onClick={openNewTab}
          className="cursor-pointer flex flex-1 w-[100%] items-center justify-around p-4 bg-black text-white rounded disabled:cursor-not-allowed disabled:opacity-50">
          <div className="items-center">
            <span className="text-xl align-center text-center">Practice your shortcuts</span>
          </div>
        </button>
        <div className="flex items-center justify-center my-4">
          <div className="w-1/3 h-0.5 bg-gray-400"></div>
          <span className="mx-2 text-gray-400">or</span>
          <div className="w-1/3 h-0.5 bg-gray-400"></div>
        </div>
        <div className="text-center text-2xl mb-4">Save a new shortcut</div>
        <p>{shortcut}</p>
        <div className="flex flex-col items-center justify-center p-6 bg-gray-200 rounded-lg">
          <div className="cursor-pointer w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-white rounded"></div>
          </div>
          <div className="text-center text-lg">
            Just press the keys on your keyboard as if you were executing the shortcut
          </div>
        </div>
      </div>
    </section>
  );
};
