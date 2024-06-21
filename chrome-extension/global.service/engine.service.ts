import { toast } from 'react-hot-toast';
import { Shortcut, db } from './dexie.service';
import { observable } from 'micro-observables';

export enum ShorcutLevel {
  easy = 1000,
  medium = 3000,
  hard = 10000,
}

export class EngineService {
  timer = Date.now();
  expectedShortcut = observable<Shortcut | null>(null);
  lastShortcut: Shortcut | null = null;

  pickShortcutToTrain(allShortcut: Shortcut[]) {
    const shortcutsWihoutLastShortcut = allShortcut.filter(s => s.id !== this.lastShortcut?.id);
    const easyShortcuts = shortcutsWihoutLastShortcut.filter(s => s.lastExecutionDuration < ShorcutLevel.easy);
    const mediumShortcuts = shortcutsWihoutLastShortcut.filter(
      s => s.lastExecutionDuration < ShorcutLevel.medium && s.lastExecutionDuration >= ShorcutLevel.easy,
    );
    const hardShortcut = shortcutsWihoutLastShortcut.filter(
      s => s.lastExecutionDuration < ShorcutLevel.hard && s.lastExecutionDuration >= ShorcutLevel.medium,
    );

    const random = Math.floor(Math.random() * 100);

    const randomEasyShortcut = Math.floor(Math.random() * easyShortcuts?.length ?? 0);
    const randomMediumShortcut = Math.floor(Math.random() * mediumShortcuts?.length ?? 0);
    const randomHardShortcut = Math.floor(Math.random() * hardShortcut?.length ?? 0);
    const randomAll = Math.floor(Math.random() * shortcutsWihoutLastShortcut?.length ?? 0);

    console.log({
      random,
      randomEasyShortcut,
      randomMediumShortcut,
      randomHardShortcut,
      easyShortcuts,
      mediumShortcuts,
      hardShortcut,
    });

    if (random < 60 && easyShortcuts.length)
      this.expectedShortcut.set(easyShortcuts[randomEasyShortcut] ?? shortcutsWihoutLastShortcut[randomAll]);
    if (random < 90 && mediumShortcuts.length)
      this.expectedShortcut.set(mediumShortcuts[randomMediumShortcut] ?? shortcutsWihoutLastShortcut[randomAll]);
    this.expectedShortcut.set(hardShortcut[randomHardShortcut] ?? shortcutsWihoutLastShortcut[randomAll]);
    this.lastShortcut = this.expectedShortcut.get();

    console.log('expectedShortcut', this.expectedShortcut.get());
  }

  async checkShortcutMatch(shortcut: string, expectedShortcut: Shortcut | null, clearShortcut: () => void) {
    if (!shortcut || !expectedShortcut) return;

    const isNotSameLength = shortcut.split(' + ').length !== expectedShortcut.shortcut.split(' + ').length;

    if (isNotSameLength) return;

    if (shortcut === expectedShortcut.shortcut) {
      console.log('Shortcut matched');
      const timeOfExecution = Date.now() - this.timer;
      toast.success('Shortcut matched in ' + timeOfExecution + 'ms');
      this.timer = Date.now();
      await sleep(1500);

      await db.shortcuts.update(expectedShortcut.id, {
        lastExecutionDuration: timeOfExecution,
      });
      clearShortcut();
      return;
    }
    clearShortcut();
    toast.error('Shortcut did not match');
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
