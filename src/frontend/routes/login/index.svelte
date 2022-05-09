<script context="module">
	export async function load({ session }) {
        session.authenticated = session.authenticated
		if (session.authenticated) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {};
	}
</script>

<script lang="ts">
    import { type User } from '$lib/backend/entities/user/User';
    import UserClient from '$lib/logic/clients/user/UserClient';
    import { fly } from 'svelte/transition';
    import { goto, invalidate } from '$app/navigation';
    import { userStore } from '$lib/logic/frontend/entities/stores';
    import { session } from '$app/stores';
import Util from '$lib/logic/frontend/generic/Util';

    let message

    let user: Partial<User> = {email: '', password: ''}

	const login = async() => {
        let res = await UserClient.login(user)
        if(res['error']){
            message = res['error']
            return
        } else{
            userStore.update(currentUser => {
                currentUser.setUserData(res);
                return currentUser;
            });
            $session['authenticated'] = true
            await goto('/profile')
        }
	} 
</script>

<section>
    <div class="container">
        <p>Login</p>
        <hr>
            <div class="field">
                <div class="control">
                <input class="form-control input" type="text" placeholder="Email" bind:value={user.email} required>
                </div>
            </div>
            
            <div class="field">
                <div class="control">
                <input class="form-control input" type="password" placeholder="Password" bind:value={user.password} required>
                </div>
            </div>
    
            <button class="button submit" on:click={login}>login</button>
            {#if message }
                <p class="error is-size-6" in:fly|local={{ y: -25, duration: 250 }}>{message}</p>
            {/if}
    </div>
</section>

<style lang="scss">
    $svelte: #ff3e00;

    .submit {
        background-color: $svelte;
        color: white
    }

    .error {
        color:$svelte
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