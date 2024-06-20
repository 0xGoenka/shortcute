const openNewTab = () => {
  console.log({ url: chrome.runtime.getURL('newtab.html') });
  chrome.tabs.create({ url: chrome.runtime.getURL('newtab/index.html') });
};

type SaveShortcutProps = {
  shortcut: string;
};

export const ListenToShortcut = ({ shortcut }: SaveShortcutProps) => {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white border border-gray-300 rounded-lg shadow-md">
        <button onClick={openNewTab}>
          <div className="cursor-pointer flex items-center justify-between p-4 bg-black text-white rounded">
            <span className="text-xl">Practice your shortcuts</span>
            <i className="fas fa-external-link-alt"></i>
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
