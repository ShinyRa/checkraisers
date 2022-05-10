<script lang='ts'>
    import { goto } from "$app/navigation";
    import { session } from "$app/stores";
    import UserClient from "$lib/logic/clients/user/UserClient";
    import { userStore } from "$lib/logic/frontend/entities/stores";
    import { onMount } from "svelte";

    onMount(async () => {
        userStore.update(currentUser => {
			currentUser.clearUserData()
            return currentUser;
        });
        session.update(currentSession =>{
            currentSession['authenticated'] = false
            return currentSession
        })
        await UserClient.logout()
        await goto('/')
    })

</script>