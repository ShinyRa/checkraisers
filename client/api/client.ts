export const post = async (path: string, data: unknown): Promise<Response> => {
	return fetch(path, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		body: JSON.stringify(data)
	});
};

export const API = {
	async shuffledDeck(): Promise<any> {
		let res;
		try {
			res = await post('/api/deck/shuffle', {});
			res = await res.json();
		} catch (e) {
			console.log(`could not shuffle deck: ${e}`);
		}

		return res;
	}
};
