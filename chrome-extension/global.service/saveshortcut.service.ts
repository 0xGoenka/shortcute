import { observable } from 'micro-observables';
import { db } from './dexie.service';

export class SaveShortcutService {
  name = observable('');
  software = observable('');
  description = observable('');

  constructor() {}

  setName = (name: string) => {
    this.name.set(name);
  };

  setSoftware = (software: string) => {
    this.software.set(software);
  };

  setDescription = (description: string) => {
    this.description.set(description);
  };

  delete = async (id: number) => {
    console.log('Delete shortcut', id);
    await db.shortcuts.delete(id);
  };

  save = async (shortcut: string) => {
    console.log('Save shortcut', this.name.get(), this.software.get(), this.description.get());
    await db.shortcuts.add({
      shortcut: shortcut,
      name: this.name.get(),
      software: this.software.get(),
      description: this.description.get(),
      lastExecutionDuration: 10000,
    });

    this.name.set('');
    this.software.set('');
    this.description.set('');
    this.getAllShortcuts();
  };

  getAllShortcuts = async () => {
    console.log('Shortcuts', await db.shortcuts.toArray());
    return await db.shortcuts.toArray();
  };
}
