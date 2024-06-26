import { WritableObservable, observable } from 'micro-observables';
export class KeyboardService {
  keys: WritableObservable<string[]> = observable([]);
  shortcut: WritableObservable<string> = observable('');
  arrayShortcut: WritableObservable<string[]> = observable([]);
  isOnListenToShortcutPage = false;
  isListening = false;

  constructor() {
    console.log('KeyboardService created');
    this.shortcut.subscribe(shortcut => console.log('shortcut', shortcut));
  }

  clear = () => {
    console.log('CLEAR');
    this.keys.set([]);
    this.shortcut.set('');
    this.arrayShortcut.set([]);
  };

  keyup = (event: KeyboardEvent) => {
    console.log('keyup', event.key);
    event.preventDefault(); // Prevent the default browser action (find in page)
    if (event.stopPropagation) event.stopPropagation();
    if (event.cancelBubble) event.cancelBubble = true;

    this.removeKey(event.key);
  };

  keydown = (event: KeyboardEvent) => {
    console.log('keydown', event.key);
    event.preventDefault(); // Prevent the default browser action (find in page)
    if (event.stopPropagation) event.stopPropagation();
    if (event.cancelBubble) event.cancelBubble = true;
    // if (event.altKey) this.addKey('Alt');
    // else if (event.shiftKey) this.addKey('Shift');
    // else if (event.metaKey) this.addKey('Meta');
    this.addKey(event.key);

    this.shortcut.set(this.keys.get().join(' + '));
    this.arrayShortcut.set(this.keys.get());
    console.log('KEYS', this.keys.get());
  };

  listen = () => {
    console.log('start of listening');
    if (this.isListening) return;
    this.isListening = true;
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  };

  stopListening = () => {
    if (!this.isListening) return;
    this.isListening = false;
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
  };

  addKey = (key: string) => {
    if (key === ' ') key = 'Space';
    if (key === 'Control') key = 'Ctrl';
    key = key.charAt(0).toUpperCase() + key.slice(1);
    if (!this.keys.get().includes(key)) {
      this.keys.update(keys => this.sortKeys([...keys, key]));
    }
  };

  removeKey = (key: string) => {
    if (key === ' ') key = 'Space';
    if (key === 'Control') key = 'Ctrl';
    key = key.charAt(0).toUpperCase() + key.slice(1);
    let savedKeys = this.keys.get();
    savedKeys = savedKeys.filter(k => k !== key);
    this.keys.set(savedKeys);
    if (savedKeys.length === 0 && this.isOnListenToShortcutPage) {
      console.log('End of listening', savedKeys.length);
      this.stopListening();
    }
  };

  // Function to sort keys, with modifiers first
  sortKeys = (keys: string[]) => {
    const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta'];
    return keys.sort((a, b) => {
      const aIsModifier = modifierKeys.includes(a);
      const bIsModifier = modifierKeys.includes(b);
      if (aIsModifier && !bIsModifier) return -1;
      if (!aIsModifier && bIsModifier) return 1;
      return 0;
    });
  };
}
