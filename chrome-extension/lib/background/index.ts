import 'webextension-polyfill';
import { exampleThemeStorage } from '@chrome-extension-boilerplate/storage';
import ExtPay from 'extpay';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

const extpay = ExtPay('shortcute'); // Careful! See note below
extpay.startBackground();

console.log('background loaded2');
console.log("Edit 'apps/chrome-extension/lib/background/index.ts' and save to reload.");
