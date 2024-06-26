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
keyboardService.isOnListenToShortcutPage = false;
const engineService = new EngineService();

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const Practice = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [reveal, setReveal] = useState(false);
  const allShortcuts: Shortcut[] = useLiveQuery(() => db.shortcuts.toArray()) ?? [];
  allShortcuts.sort((a, b) => (b.lastExecutionDuration ?? 10000) - (a.lastExecutionDuration ?? 100000));
  const shortcut = useObservable(keyboardService.shortcut);
  const arrayShortcut = useObservable(keyboardService.arrayShortcut);
  const expectedShortcut = useObservable(engineService.expectedShortcut);

  const arrayExpectedShortcut = keyboardService.shortcutToArr(expectedShortcut?.shortcut ?? '');

  useEffect(() => {
    engineService.checkShortcutMatch(shortcut, expectedShortcut, () => keyboardService.clear());
    keyboardService.listen();
  }, [shortcut]);

  useEffect(() => {
    engineService.pickShortcutToTrain(allShortcuts);
    keyboardService.listen();
  }, [allShortcuts]);

  if (showSettings) {
    return (
      <Settings
        allShortcuts={allShortcuts}
        saveShortcutService={saveShortcutService}
        setShowSettings={setShowSettings}></Settings>
    );
  }

  return (
    <div className="h-full">
      <Toaster position="top-center" reverseOrder={false} />
      <header className="w-full flex justify-between items-center p-4">
        <div className="text-lg font-medium">Shortcut_app</div>
        <nav className="space-x-4">
          {/* <a href="#" className="text-gray-700">
            Practice
          </a> */}
          <button className="text-gray-700" onClick={() => setShowSettings(true)}>
            Shortcuts
          </button>
          <button className="text-gray-700">Account</button>
        </nav>
      </header>
      <div className="flex flex-col items-center justify-center">
        <main className="flex flex-col items-center mt-16">
          <div className="text-gray-500 text-lg">{expectedShortcut?.software}</div>
          <h1 className="text-3xl font-bold mt-2 text-black">{expectedShortcut?.name}</h1>
          <div className="bg-gray-100 rounded-lg shadow-md p-8 mt-8 w-96 flex flex-col items-center">
            {!reveal ? (
              <div className="flex flex-row items-end h-16 ms-2">
                {shortcut == '' && (
                  <div className="bg-black text-white text-2xl font-semibold rounded-md w-16 h-1 flex items-center justify-center mx-2 mb-4 animate-blink"></div>
                )}
                {shortcut !== '' &&
                  arrayShortcut.map((keystroke, i) => (
                    <div
                      key={i}
                      className="bg-black text-white text-2xl font-semibold rounded-md w-16 h-16 flex items-center justify-center mx-2 mb-4">
                      {capitalizeFirstLetter(keystroke)}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex justify-center">
                {shortcut[0] !== '' &&
                  arrayExpectedShortcut.map((keystroke, i) => (
                    <div
                      key={i}
                      className="bg-black text-white text-2xl font-semibold rounded-md w-16 h-16 flex items-center justify-center mx-2 mb-4">
                      {capitalizeFirstLetter(keystroke)}
                    </div>
                  ))}
              </div>
            )}
            <p className="text-gray-500 text-center">
              Press the keys of the corresponding shortcut as if you were doing it
            </p>
          </div>
          <div>
            {!reveal ? (
              <button onClick={() => setReveal(true)} className="mt-8 bg-black text-white py-2 px-4 rounded">
                Reveal shortcut
              </button>
            ) : (
              <button
                onClick={() => {
                  engineService.pickShortcutToTrain(allShortcuts);
                  setReveal(false);
                  keyboardService.clear();
                }}
                className="mt-8 bg-black text-white py-2 px-4 rounded">
                Continue
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Practice, <div> Loading ... </div>), <div> Error Occur </div>);
