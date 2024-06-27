import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { KeyboardService } from '../../../chrome-extension/global.service/keyboard.service';
import { useObservable } from 'micro-observables';
import { SaveShortcut } from './pages/SaveShortcut';
import { ListenToShortcut } from './pages/ListenToShortcut';
import ExtPay from 'extpay';
import { useEffect } from 'react';

const keyboardService = new KeyboardService();

const extPay = ExtPay('shortcute');

const Popup = () => {
  const shortcut = useObservable(keyboardService.shortcut);
  const keys = useObservable(keyboardService.keys);
  const arrayShortcut = useObservable(keyboardService.arrayShortcut);
  console.log('keys', keys, 'shortcut', shortcut);
  addEventListener('compositionend', e => {
    console.log('compositionend', e);
  });

  addEventListener('compositionstart', e => {
    console.log('compositionend', e);
  });

  useEffect(() => {
    extPay.onPaid.addListener(user => {
      console.log('user paid!', user);
    });
    extPay.getUser().then(user => {
      // extPay.openLoginPage();
      if (!user.paid) {
        console.log("user hasn't paid yet");
        // extPay.openPaymentPage();
      }
      console.log('user', user);
    });
  }, []);

  if (shortcut.length === 0 || keys.length) {
    keyboardService.isOnListenToShortcutPage = true;
    keyboardService.listen();
    return <ListenToShortcut shortcut={shortcut} arrayShortcut={arrayShortcut}></ListenToShortcut>;
  } else {
    keyboardService.isOnListenToShortcutPage = false;
    return <SaveShortcut shortcut={shortcut} keyboardService={keyboardService} />;
  }
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
