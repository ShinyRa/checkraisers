export type User = {
	email: string;
	username: string;
	password: string;
	profilePicture: string | File;
	chips?: number;
};
