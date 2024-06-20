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

  pickShortcutToTrain(allShortcut: Shortcut[]) {
    const easyShortcut = allShortcut.filter(s => s.lastExecutionDuration < ShorcutLevel.easy);
    const mediumShortcut = allShortcut.filter(
      s => s.lastExecutionDuration < ShorcutLevel.medium && s.lastExecutionDuration >= ShorcutLevel.easy,
    );
    const hardShortcut = allShortcut.filter(
      s => s.lastExecutionDuration < ShorcutLevel.hard && s.lastExecutionDuration >= ShorcutLevel.medium,
    );

    const random = Math.floor(Math.random() * 100);

    const randomEasyShortcut = Math.floor(Math.random() * easyShortcut?.length ?? 0);
    const randomMediumShortcut = Math.floor(Math.random() * mediumShortcut?.length ?? 0);
    const randomHardShortcut = Math.floor(Math.random() * hardShortcut?.length ?? 0);
    const randomAll = Math.floor(Math.random() * allShortcut?.length ?? 0);

    console.log({
      random,
      randomEasyShortcut,
      randomMediumShortcut,
      randomHardShortcut,
      easyShortcut,
      mediumShortcut,
      hardShortcut,
    });

    if (random < 60 && easyShortcut.length)
      this.expectedShortcut.set(easyShortcut[randomEasyShortcut] ?? allShortcut[randomAll]);
    if (random < 90 && mediumShortcut.length)
      this.expectedShortcut.set(mediumShortcut[randomMediumShortcut] ?? allShortcut[randomAll]);
    this.expectedShortcut.set(hardShortcut[randomHardShortcut] ?? allShortcut[randomAll]);
  }

  async checkShortcutMatch(shortcut: string, expectedShortcut: Shortcut | null, clearShortcut: () => void) {
    if (!shortcut || !expectedShortcut) return;

    if (shortcut.length !== expectedShortcut.shortcut.length) return;

    if (shortcut === expectedShortcut.shortcut) {
      console.log('Shortcut matched');
      const timeOfExecution = Date.now() - this.timer;
      toast.success('Shortcut matched in ' + timeOfExecution + 'ms');
      this.timer = Date.now();

      await db.shortcuts.update(expectedShortcut.id, {
        lastExecutionDuration: timeOfExecution,
      });
      const allShortcut = await db.shortcuts.toArray();
      this.pickShortcutToTrain(allShortcut);
      clearShortcut();
      return;
    }
    clearShortcut();
    toast.error('Shortcut did not match');
  }
}
