<script lang="ts">
    import { session } from '$app/stores'
    import { onMount } from 'svelte';

    let profile = JSON.parse(localStorage.getItem("session"))
    let email = profile['username']
    let username = profile['email']
    let chips = profile['chips']

    onMount(() => {
        $session
	});

    const updateProfile = async() => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json',  'Accept': 'application/json'},
			body: JSON.stringify(
                { 
                    email: email,
                    username: username,
                    chips: chips
                }
            )		
		};
		await fetch(`api/user/profile`, requestOptions).then( resp => {
			return resp.json()
		}).then(json => {
            session.set(json)
            console.log(localStorage.getItem('session'))
		})
    }
</script>

<section>
    <div class="container">

        <p>Profile</p>
        <hr>

        <div class="field">
            <div class="control">
            <input class="input" type="text" bind:value={email}>
            </div>
        </div>
        
        <div class="field">
            <div class="control">
            <input class="input" type="text" bind:value={username}>
            </div>
        </div>

        <div class="field">
            <div class="control">
            <input class="input" type="text" bind:value={chips}>
            </div>
        </div>

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