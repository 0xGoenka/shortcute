import { WritableObservable, observable } from 'micro-observables';

export class KeyboardService {
  keys: WritableObservable<string[]> = observable([]);
  shortcut: WritableObservable<string> = observable('');
  arrayShortcut: WritableObservable<string[]> = observable([]);
  isOnListenToShortcutPage = false;
  isListening = false;
  os = '';

  constructor() {
    console.log('KeyboardService created');
    this.shortcut.subscribe(shortcut => console.log('shortcut', shortcut));
    chrome.runtime.getPlatformInfo(info => {
      // Display host OS in the console
      console.log(' OS = ', info.os);
      this.os = info.os;
    });
  }

  clear = () => {
    console.log('CLEAR');
    this.keys.set([]);
    this.shortcut.set('');
    this.arrayShortcut.set([]);
  };

  keyup = (event: KeyboardEvent) => {
    console.log('keyup', event.key, event);
    event.preventDefault(); // Prevent the default browser action (find in page)
    if (event.stopPropagation) event.stopPropagation();
    if (event.cancelBubble) event.cancelBubble = true;

    if (event.altKey) this.removeKey('Alt');
    if (event.shiftKey) this.removeKey('Shift');
    if (event.metaKey) this.removeKey('Meta');
    this.keys.set([]);
    this.stopListening();
    // this.removeKey(event.key);
  };

  keydown = (event: KeyboardEvent) => {
    console.log('keydown', event.key);
    event.preventDefault(); // Prevent the default browser action (find in page)
    if (event.stopPropagation) event.stopPropagation();
    if (event.cancelBubble) event.cancelBubble = true;
    if (event.altKey) this.addKey('Alt');
    if (event.shiftKey) this.addKey('Shift');
    if (event.metaKey) this.addKey('Meta');
    this.addKey(event.key);

    this.shortcut.set(this.keys.get().join(' + '));
    this.arrayShortcut.set(this.keys.get());
    console.log('KEYS', this.keys.get());
  };

  listen = () => {
    if (this.isListening) return;
    this.isListening = true;
    console.log('start of listening');
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  };

  stopListening = () => {
    if (!this.isListening) return;
    this.isListening = false;
    console.log('End of listening');
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
  };

  addKey = (key: string) => {
    if (key === ' ') key = 'Space';
    if (key === 'Control') key = 'Ctrl';
    if (key === 'Meta' && this.os === 'mac') key = 'Cmd';
    if (key === 'Meta' && this.os === 'win') key = 'Win';
    key = key.charAt(0).toUpperCase() + key.slice(1);
    if (!this.keys.get().includes(key)) {
      this.keys.update(keys => this.sortKeys([...keys, key]));
    }
  };

  removeKey = (key: string) => {
    if (key === ' ') key = 'Space';
    if (key === 'Control') key = 'Ctrl';
    if (key === 'Meta' && this.os === 'mac') key = 'Cmd';
    if (key === 'Meta' && this.os === 'win') key = 'Win';
    key = key.charAt(0).toUpperCase() + key.slice(1);
    let savedKeys = this.keys.get();
    savedKeys = savedKeys.filter(k => k !== key);
    this.keys.set(savedKeys);
    if (savedKeys.length === 0 && this.isOnListenToShortcutPage) {
      this.stopListening();
    }
  };

  // Function to sort keys, with modifiers first
  sortKeys = (keys: string[]) => {
    const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta', 'Cmd'];

    const sortedModifiersKeys = keys.sort((a, b) => {
      const aIsModifier = modifierKeys.includes(a);
      const bIsModifier = modifierKeys.includes(b);
      if (aIsModifier && !bIsModifier) return -1;
      if (!aIsModifier && bIsModifier) return 1;
      return 0;
    });

    const sortedKeys = sortedModifiersKeys.sort((a, b) => {
      if (a.length === 1 && b.length === 1) return a.localeCompare(b);
      return 0;
    });

    console.log('SORTED KEYS', sortedKeys);

    return sortedKeys;
  };

  shortcutToArr = (shortcut: string) => {
    return shortcut.split(' + ');
  };
}
