import '@src/Newtab.css';
import '@src/Newtab.scss';
import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { useEffect, useState } from 'react';
import { SaveShortcutService } from '../../../chrome-extension/global.service/saveshortcut.service';
import { Settings } from './Settings';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Shortcut } from '../../../chrome-extension/global.service/dexie.service';
import { EngineService } from '../../../chrome-extension/global.service/engine.service';
import { KeyboardService } from '../../../chrome-extension/global.service/keyboard.service';
import { useObservable } from 'micro-observables';
import { Toaster } from 'react-hot-toast';

const saveShortcutService = new SaveShortcutService();
const keyboardService = new KeyboardService();
const engineService = new EngineService();

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const Practice = () => {
  const [showSettings, setShowSettings] = useState(false);
  const allShortcuts: Shortcut[] = useLiveQuery(() => db.shortcuts.toArray()) ?? [];
  allShortcuts.sort((a, b) => (b.lastExecutionDuration ?? 10000) - (a.lastExecutionDuration ?? 100000));
  const shortcut = useObservable(keyboardService.shortcut);
  const arrayShortcut = useObservable(keyboardService.arrayShortcut);
  const expectedShortcut = useObservable(engineService.expectedShortcut);

  console.log('Shortcut: ', shortcut, expectedShortcut?.shortcut);

  useEffect(() => {
    engineService.checkShortcutMatch(shortcut, expectedShortcut, () => keyboardService.clear());
  }, [shortcut]);

  useEffect(() => {
    engineService.pickShortcutToTrain(allShortcuts);
  }, [allShortcuts]);

  if (showSettings) {
    return (
      <Settings
        allShortcuts={allShortcuts}
        saveShortcutService={saveShortcutService}
        setShowSettings={setShowSettings}></Settings>
    );
  }

  keyboardService.listen();

  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-gray-50 flex items-center justify-center min-h-screen">
        <button
          className="bg-black text-white py-2 p-8 rounded-md fixed top-10 right-10"
          onClick={() => setShowSettings(true)}>
          Settings
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-8 text-black">{expectedShortcut?.name}</h1>
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 mb-8 inline-block">
            <div className="flex justify-center">
              {shortcut[0] === '' && <div className="animate-bounce text-xl p-8">Listenning for keystrokes...</div>}
              {shortcut[0] !== '' &&
                arrayShortcut.map((keystroke, i) => (
                  <div
                    key={i}
                    className="bg-black text-white text-2xl font-semibold rounded-md w-16 h-16 flex items-center justify-center mx-2 mb-4">
                    {capitalizeFirstLetter(keystroke)}
                  </div>
                ))}
            </div>
            <p className="text-gray-500">Press the keys of the corresponding shortcut as if you were doing it</p>
          </div>
          <div>
            <button className="bg-black text-white py-2 p-8 rounded-md">Continue (Space)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Practice, <div> Loading ... </div>), <div> Error Occur </div>);
