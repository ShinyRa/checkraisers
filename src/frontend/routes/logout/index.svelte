<script context="module">
    import { browser } from '$app/env';
    import UserClient from '$lib/logic/clients/user/UserClient';

    /** @type {import('@sveltejs/kit').Load} */
    export async function load({ session }) {
	    await UserClient.logout()
        if (browser) session['authenticated'] = false;
        return {
            status: 302,
            redirect: "/",
        };
    }
</script>