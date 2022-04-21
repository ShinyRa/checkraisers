export interface IRankable<H, R> {
	beats: (obj: H) => number;
	score: R;
}
