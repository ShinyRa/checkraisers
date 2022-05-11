import { PlayerHand } from './hand/PlayerHand';
import { PlayerAction } from './round/action/PlayerAction';
class Player {
	email: string;
	username: string;
	profilePicture: string;
	totalChips: number;
	hand: PlayerHand;
	//name: string;
	//surname: string;
	//dateOfBirth: Date;

	constructor(
		email: string,
		username: string,
		profilePicture: string,
		totalChips: number,
		hand?: PlayerHand
		//surname: string = null,
		//name: string = null,
		//dateOfBirth: Date = null,
	) {
		this.email = email;
		this.username = username;
		this.profilePicture = profilePicture;
		this.totalChips = totalChips;
		this.hand = hand ? hand : new PlayerHand();
		//this.name = username ? username : name;
		//this.surname = surname;
		//this.dateOfBirth = dateOfBirth ? dateOfBirth : new Date();
	}

	canTakeAction(action: PlayerAction): boolean {
		return this.totalChips >= action.chips;
	}

	takeAction(action: PlayerAction): void {
		this.totalChips -= action.chips;
	}

	// static mock(): Player {
	// 	const mockNames = [
	// 		'James',
	// 		'John',
	// 		'Robert',
	// 		'Michael',
	// 		'William',
	// 		'David',
	// 		'Richard',
	// 		'Charles',
	// 		'Joseph',
	// 		'Thomas',
	// 		'Christopher',
	// 		'Daniel',
	// 		'Paul',
	// 		'Mark',
	// 		'Donald',
	// 		'George',
	// 		'Kenneth',
	// 		'Steven',
	// 		'Edward',
	// 		'Brian',
	// 		'Ronald',
	// 		'Anthony',
	// 		'Kevin',
	// 		'Jason',
	// 		'Jeff'
	// 	];

	// 	const mockLastNames = [
	// 		'Smith',
	// 		'Johnson',
	// 		'Williams',
	// 		'Brown',
	// 		'Jones',
	// 		'Garcia',
	// 		'Miller',
	// 		'Davis',
	// 		'Rodriguez',
	// 		'Martinez',
	// 		'Hernandez',
	// 		'Lopez',
	// 		'Gonzalez',
	// 		'Wilson',
	// 		'Anderson',
	// 		'Thomas',
	// 		'Taylor',
	// 		'Moore',
	// 		'Jackson',
	// 		'Martin',
	// 		'Lee',
	// 		'Perez',
	// 		'Thompson',
	// 		'White',
	// 		'Harris'
	// 	];

	// 	const name = mockNames[Math.floor(Math.random() * mockNames.length)];
	// 	const username = mockNames[Math.floor(Math.random() * mockNames.length)];
	// 	const surname = mockLastNames[Math.floor(Math.random() * mockLastNames.length)];

	// 	return new Player(username, surname, name);
	// }
}

export default Player;
