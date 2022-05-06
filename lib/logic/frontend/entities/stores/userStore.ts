import { writable } from 'svelte/store';
import UserRepository from './../repositories/UserRepository';

export const userStore = writable(new UserRepository())