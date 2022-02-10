/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post({ request }): Promise<Record<string, any>> {
	return {
		body: {
			data: 'test'
		}
	};
}