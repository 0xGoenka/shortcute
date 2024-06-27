import { Shortcut } from '../../../chrome-extension/global.service/dexie.service';
import { SaveShortcutService } from '../../../chrome-extension/global.service/saveshortcut.service';
import { RiDeleteBin5Fill } from 'react-icons/ri';

type SettingsProps = {
  allShortcuts: Shortcut[];
  saveShortcutService: SaveShortcutService;
  setShowSettings: (showSettings: boolean) => void;
};

export const Settings = ({ allShortcuts, saveShortcutService, setShowSettings }: SettingsProps) => {
  return (
    <div className="App">
      <header className="w-full flex justify-between items-center p-4">
        <div className="text-lg font-medium">Shortcut_app</div>
        <nav className="space-x-4">
          <button className="text-gray-700" onClick={() => setShowSettings(false)}>
            Practice
          </button>
          <button className="text-gray-700">Account</button>
        </nav>
      </header>
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl mb-8 text-black">Shortcuts</h1>
          <div className="w-full max-w-4xl">
            <table className="min-w-full bg-white">
              <thead className="">
                <tr className="bg-black text-white rounded-xl">
                  <th className="py-3 px-4 text-left rounded-l-md">Shortcut</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Software</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Solving time</th>
                  <th className="py-3 px-4 text-left rounded-r-md">{'        '}</th>
                </tr>
              </thead>
              <tbody>
                {allShortcuts.map((shortcut, i) => (
                  <tr className="border-b-[1px] hover:bg-[#E9E6E2]" key={i}>
                    <td className="py-3 px-4">{shortcut.shortcut}</td>
                    <td className="py-3 px-4">{shortcut.name}</td>
                    <td className="py-3 px-4">{shortcut.software}</td>
                    <td className="py-3 px-4">{shortcut.description}</td>
                    <td className="py-3 px-4">{shortcut.lastExecutionDuration} ms</td>
                    <td className="text-center">
                      <button onClick={() => saveShortcutService.delete(shortcut?.id ?? -1)}>
                        <RiDeleteBin5Fill size={16} className="hover:text-red-600"></RiDeleteBin5Fill>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
