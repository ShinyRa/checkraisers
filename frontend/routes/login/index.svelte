<script lang="ts">
    import { session } from '$app/stores'
    import { onMount } from 'svelte';

    let email: string;
    let password: string
    
	const login = async() => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json',  'Accept': 'application/json'},
			body: JSON.stringify({ email: email, password: password })		
		};
		await fetch(`api/user/login`, requestOptions).then( resp => {
			return resp.json()
		}).then(json => {
			session.set(json)
		})
	} 
</script>

<section>
    <div class="container">
        <div class="field">
            <div class="control">
            <input class="input" type="text" placeholder="Email" bind:value={email}>
            </div>
        </div>
        
        <div class="field">
            <div class="control">
            <input class="input" type="password" placeholder="Password" bind:value={password}>
            </div>
        </div>

        <button class="button submit" on:click={login}>login</button>
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