<script lang="ts">
import { goto } from "$app/navigation";

    let email: string;
    let username: string;
    let password: string

	const registerUser = async() => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(
                {   
                    email: email, 
                    username: username, 
                    password: password
                })		
		};
		await fetch(`api/user/register`, requestOptions).then( resp => {
			return resp.json()
		}).then(json => {
			console.log(json)
            goto('/login')
		})
	}

</script>

<section>
    <div class="container">

        <p>Register</p>
        <hr>    

        <div class="field">
            <div class="control">
            <input class="input" type="text" placeholder="Email" bind:value={email}>
            </div>
        </div>

        <div class="field">
            <div class="control">
            <input class="input" type="text" placeholder="Username" bind:value={username}>
            </div>
        </div>
        
        <div class="field">
            <div class="control">
            <input class="input" type="password" placeholder="Password" bind:value={password}>
            </div>
        </div>

        <button class="button submit" on:click={registerUser}>create account</button>
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