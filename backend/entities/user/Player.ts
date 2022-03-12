import { PlayerHand } from '../hand/PlayerHand';
import type { User } from './User';

class Player implements User {
	username: string;
	name: string;
	surname: string;
	dateOfBirth: Date;
	totalChips: number;
	hand: PlayerHand;

	constructor(
		username: string = null,
		surname: string = null,
		name: string = null,
		dateOfBirth: Date = null,
		totalChips: number = null,
		hand: PlayerHand = null
	) {
		this.username = username;
		this.name = username ? username : name;
		this.surname = surname;
		this.dateOfBirth = dateOfBirth ? dateOfBirth : new Date();
		this.totalChips = totalChips ? totalChips : 1000;
		this.hand = hand ? hand : new PlayerHand();
	}

	mock = (): Player => {
		const mockNames = [
			'James',
			'John',
			'Robert',
			'Michael',
			'William',
			'David',
			'Richard',
			'Charles',
			'Joseph',
			'Thomas',
			'Christopher',
			'Daniel',
			'Paul',
			'Mark',
			'Donald',
			'George',
			'Kenneth',
			'Steven',
			'Edward',
			'Brian',
			'Ronald',
			'Anthony',
			'Kevin',
			'Jason',
			'Jeff'
		];

		const mockLastNames = [
			'Smith',
			'Johnson',
			'Williams',
			'Brown',
			'Jones',
			'Garcia',
			'Miller',
			'Davis',
			'Rodriguez',
			'Martinez',
			'Hernandez',
			'Lopez',
			'Gonzalez',
			'Wilson',
			'Anderson',
			'Thomas',
			'Taylor',
			'Moore',
			'Jackson',
			'Martin',
			'Lee',
			'Perez',
			'Thompson',
			'White',
			'Harris'
		];

		this.name = mockNames[Math.floor(Math.random() * mockNames.length)];
		this.username = mockNames[Math.floor(Math.random() * mockNames.length)];
		this.surname = mockLastNames[Math.floor(Math.random() * mockLastNames.length)];

		return this;
	};
}

export default Player;
