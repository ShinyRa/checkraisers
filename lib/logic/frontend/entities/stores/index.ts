import { io, Socket } from 'socket.io-client';
import { readable, writable, type Readable } from 'svelte/store';
import UserRepository from '../repositories/UserRepository';

export const userStore = writable(new UserRepository());
export const socketStore: Readable<Socket> = readable(io('ws://145.109.159.241:3001'));
