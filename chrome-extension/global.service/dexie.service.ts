import Dexie, { Table } from 'dexie';

export interface Shortcut {
  id?: number;
  name: string;
  shortcut: string;
  description?: string;
  software?: string;
  lastExecutionDuration: number;
}

export class ShotcutDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  shortcuts!: Table<Shortcut>;

  constructor() {
    super('shortcut');
    this.version(1).stores({
      shortcuts: '++id, name, shortcut, description, software, lastExecutionDuration', // Primary key and indexed props
    });
  }
}

export const db = new ShotcutDB();
