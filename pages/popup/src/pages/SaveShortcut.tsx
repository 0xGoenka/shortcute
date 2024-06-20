import { MutableRefObject, useEffect, useRef } from 'react';
import { KeyboardService } from '../../../../chrome-extension/global.service/keyboard.service';
import { SaveShortcutService } from '../../../../chrome-extension/global.service/saveshortcut.service';
import { useObservable } from 'micro-observables';

const saveShortcutService = new SaveShortcutService();

type SaveShortcutProps = {
  shortcut: string;
  keyboardService: KeyboardService;
};

export const SaveShortcut = ({ shortcut, keyboardService }: SaveShortcutProps) => {
  const timeoutID: MutableRefObject<undefined | number> = useRef(undefined);
  const name = useObservable(saveShortcutService.name);

  useEffect(() => {
    timeoutID.current = setTimeout(() => {
      keyboardService.stopListening();
    }, 1000);
    console.log('Else');
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-center text-2xl mb-4">Save a new shorcut</h1>
        <div className="mb-4">
          <label className="block text-lg mb-2">
            the shortcut{' '}
            <span className="float-right">
              <button
                onClick={() => {
                  keyboardService.clear();
                  clearTimeout(timeoutID.current);
                }}>
                <i className="fas fa-redo"></i> Redo
              </button>
            </span>
          </label>
          <div className="shortcut-box">{shortcut}</div>
        </div>
        <form
          onSubmit={() => {
            if (shortcut.length === 0 || name.length === 0) return;
            saveShortcutService.save(shortcut);
            keyboardService.shortcut.set('');
          }}>
          <div className="mb-4">
            <label className="block text-lg mb-2">
              Name <span className="text-sm">(What does the shortcut do)</span>
              <input type="text" className="input-box" onChange={e => saveShortcutService.setName(e.target.value)} />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2">
              Software <span className="text-sm">(optional)</span>
              <input
                type="text"
                className="input-box"
                onChange={e => saveShortcutService.setSoftware(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2">
              Description <span className="text-sm">(optional)</span>
              <input
                type="text"
                className="input-box"
                onChange={e => saveShortcutService.setDescription(e.target.value)}
              />
            </label>
          </div>
          <button
            className="save-button text-center cursor-pointer disabled:opacity-50 w-full py-2 bg-blue-500 text-white rounded-lg disabled:cursor-not-allowed"
            disabled={shortcut.length === 0 || name.length === 0}
            onClick={() => {
              saveShortcutService.save(shortcut);
              keyboardService.shortcut.set('');
            }}>
            Save shortcut
          </button>
        </form>
      </div>
    </div>
  );
};
