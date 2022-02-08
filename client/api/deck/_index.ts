/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post({ body: any }): Promise<Record<string, any>> {
	return {
		body: {
			data: 'test'
		}
	};
}
