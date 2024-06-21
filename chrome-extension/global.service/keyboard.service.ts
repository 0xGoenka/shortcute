import { WritableObservable, observable } from 'micro-observables';
export class KeyboardService {
  keys: string[] = [];
  shortcut: WritableObservable<string> = observable('');
  arrayShortcut: WritableObservable<string[]> = observable([]);

  constructor() {
    console.log('KeyboardService created');
    this.shortcut.subscribe(shortcut => console.log('shortcut', shortcut));
  }

  clear = () => {
    console.log('CLEAR');
    this.keys = [];
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

    this.shortcut.set(this.keys.join(' + '));
    this.arrayShortcut.set(this.keys);
    console.log('KEYS', this.keys);
  };

  listen = () => {
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  };

  stopListening = () => {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
  };

  addKey = (key: string) => {
    if (key === ' ') key = 'Space';
    if (key === 'Control') key = 'Ctrl';
    if (!this.keys.includes(key)) {
      this.keys.push(key);
      this.keys = this.sortKeys(this.keys);
    }
  };

  removeKey = (key: string) => {
    if (key === ' ') key = 'Space';
    if (key === 'Control') key = 'Ctrl';
    this.keys = this.keys.filter(k => k !== key);
  };

  // Array to store currently pressed keys

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
