import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { KeyboardService } from '../../../chrome-extension/global.service/keyboard.service';
import { useObservable } from 'micro-observables';
import { SaveShortcut } from './pages/SaveShortcut';
import { ListenToShortcut } from './pages/ListenToShortcut';

const keyboardService = new KeyboardService();

const Popup = () => {
  const shortcut = useObservable(keyboardService.shortcut);

  if (shortcut.length === 0) {
    keyboardService.listen();
    return <ListenToShortcut shortcut={shortcut}></ListenToShortcut>;
  } else {
    return <SaveShortcut shortcut={shortcut} keyboardService={keyboardService} />;
  }
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
