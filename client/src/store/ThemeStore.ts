import { writable, type Writable } from 'svelte/store';

export const AppThemeStore: Writable<'synthwave' | 'winter'> = writable('synthwave');
