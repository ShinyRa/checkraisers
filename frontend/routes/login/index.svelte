<script lang="ts">
    import { session } from '$app/stores';
    import { type User } from '$lib/entities/user/User';
    import UserClient from '../api/user/UserClient';
    import Util from '../_utils/Util';
    $session

    let user: Partial<User> = {email: '', password: ''}

	const login = async() => {
        UserClient.login(user).then((res) => {
            if(res['error']) return 
            res['profilePicture'] = `data:image/png;base64,${Util.binaryToBase64Conversion(res['profilePicture'].data)}`;
            session.set(res)
        })
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