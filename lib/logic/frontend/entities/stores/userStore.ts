import { io, Socket } from 'socket.io-client';
import { writable, type Writable } from 'svelte/store';
import UserRepository from './../repositories/UserRepository';

export const userStore = writable(new UserRepository())
export const socketStore: Writable<Socket> = writable()