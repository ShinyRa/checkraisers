<script lang="ts">
    import { session } from '$app/stores'
    import { User } from '$lib/entities/user/User';
    import { onMount } from 'svelte';
    import { userClient } from '../api/user/userClient';

    let profile = $session
    let user: Partial<User> = {
        email: profile['username'] ? profile['username'] : 'not logged in', 
        username: profile['email'] ? profile['email']: 'not logged in', 
        chips: profile['chips'] ?  profile['chips']: 0
    }

    onMount(() => {
        $session
	});

    const updateProfile = async() => {
        userClient.update(user).then((res) => {
                session.set(res['value'])
            })
    }
</script>

<section>
    <div class="container">

        <p>Profile</p>
        <hr>
        <form>
            <div class="field">
                <div class="control">
                <input class="input" type="text" bind:value={user.email} required>
                </div>
            </div>
            
            <div class="field">
                <div class="control">
                <input class="input" type="text" bind:value={user.username} required>
                </div>
            </div>
    
            <div class="field">
                <div class="control">
                <input class="input" type="number" bind:value={user.chips} required>
                </div>
            </div>
        </form>

        <button class="button submit" on:click={updateProfile}>Update Account</button>
    </div>
</section>

<style lang="scss">
    $svelte: #ff3e00;

    .submit {
        background-color: $svelte;
        color: white
    }

    section {
		margin: 0 auto;
	}

    .container {
        margin-top: 50px    ;
		text-align: center;
		font-size: 40px;
	}
</style>