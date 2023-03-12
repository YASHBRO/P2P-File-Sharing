import type { PageLoad } from './$types';

export const load = (({ params }) => {
	return { receiverId: params.receiverId };
}) satisfies PageLoad;
