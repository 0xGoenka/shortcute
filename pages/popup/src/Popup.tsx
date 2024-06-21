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

  if (shortcut.length === 0) {
    keyboardService.listen();
    return <ListenToShortcut shortcut={shortcut}></ListenToShortcut>;
  } else {
    return <SaveShortcut shortcut={shortcut} keyboardService={keyboardService} />;
  }
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
