import { PlayerHand } from './hand/PlayerHand';
class Player {
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

	static mock = (): Player => {
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

		const name = mockNames[Math.floor(Math.random() * mockNames.length)];
		const username = mockNames[Math.floor(Math.random() * mockNames.length)];
		const surname = mockLastNames[Math.floor(Math.random() * mockLastNames.length)];

		return new Player(username, surname, name);
	};
}

export default Player;
