import { Shortcut } from '../../../chrome-extension/global.service/dexie.service';
import { SaveShortcutService } from '../../../chrome-extension/global.service/saveshortcut.service';

type SettingsProps = {
  allShortcuts: Shortcut[];
  saveShortcutService: SaveShortcutService;
  setShowSettings: (showSettings: boolean) => void;
};

export const Settings = ({ allShortcuts, saveShortcutService, setShowSettings }: SettingsProps) => {
  return (
    <div className="App">
      <body className="bg-gray-50 flex items-center justify-center min-h-screen">
        <button
          className="bg-black text-white py-2 p-8 rounded-md fixed top-10 right-10"
          onClick={() => setShowSettings(false)}>
          Practice
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-8 text-black">All shortcuts</h1>
          <div className="w-full max-w-4xl">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-black text-white">
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Shortcut</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Software</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Solving time</th>
                  <th className="py-3 px-4 text-left">Delete</th>
                </tr>
              </thead>
              <tbody>
                {allShortcuts.map((shortcut, i) => (
                  <tr className="bg-gray-100" key={i}>
                    <td className="py-3 px-4">{shortcut.id}</td>
                    <td className="py-3 px-4">{shortcut.shortcut}</td>
                    <td className="py-3 px-4">{shortcut.name}</td>
                    <td className="py-3 px-4">{shortcut.description}</td>
                    <td className="py-3 px-4">{shortcut.software}</td>
                    <td className="py-3 px-4">{shortcut.lastExecutionDuration} ms</td>
                    <td className="">
                      <button onClick={() => saveShortcutService.delete(shortcut?.id ?? -1)} className="">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </div>
  );
};
