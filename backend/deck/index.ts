import type { RequestHandler } from '@sveltejs/kit';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(request: RequestHandler): Promise<Record<string, unknown>> {
	return {
		body: {
			data: request
		}
	};
}
