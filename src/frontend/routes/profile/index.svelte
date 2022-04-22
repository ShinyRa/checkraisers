<script lang="ts">
    import { session } from '$app/stores'
    import { type User } from '$lib/backend/entities/user/User';
        import UserClient from '$lib/logic/clients/user/UserClient';
    import { fly } from 'svelte/transition';
	import {assets as assetsPath } from '$app/paths';

    $session

    let updated

    const MAXIUM_FILE_SIZE = 1500000

    let user: Partial<User> = {
        email: $session['user']['email'],
        username: $session['user']['username'], 
        chips: $session['user']['chips'], 
        profilePicture: $session['user']['profilePicture']
    }

    //The only way the browser will not use the previous cached image
    let preview: string = `${assetsPath}/avatars/${user.profilePicture}`

    const onFileSelected =(e)=>{
        let reader = new FileReader()
        const image: File = e.target.files[0]
        if(image.size > MAXIUM_FILE_SIZE){
            alert(`profile picture exceeds maxiumum file size by: ${image.size && ((image.size - MAXIUM_FILE_SIZE)/1000000).toFixed(2)}MB`)
            return
        }
        //sets state of modification of image to reload image instead of using cached image
        user.profilePicture = image
        reader.readAsDataURL(image);
        reader.onload = (e) => {
                preview = e.target.result as string
            };
    }

    const updateProfile = async() => {
        //Refactor into URLSearchParams
        let fd = new FormData()
        fd.append('email', user.email)
        fd.append('username', user.username)
        fd.append('chips', user.chips.toString())
        if(typeof user.profilePicture !== 'string') fd.append('profilePicture', user.profilePicture)

        let res = await UserClient.update(fd)
        updated = res['ok']
        console.log(updated)
        session.set({ user: res['value'] })
        console.log($session['user']['profilePicture'])
    }
</script>

<section>
    <div id='form' class="container">
        <p>Profile</p>
        <hr>         
        <div class="field">
            <div class="control">
            <input class="input" type="text" name="username" placeholder="username" bind:value={user.username} required>
            </div>
        </div>
        
        <div class="field">
            <div class="control">
            <input class="input" type="number" name="chips" placeholder="amount of chips" bind:value={user.chips} required>
            </div>
        </div>
        <div>

        <div class="picture">
            
            <img class="avatar" src={preview} alt='no_profilepicture'/>

            <input name="profilePicture" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)}>
        </div>
        <button class="button submit" on:click={updateProfile}>Update Account</button>
        {#if updated }
            <p class="success is-size-6" in:fly|local={{ y: -25, duration: 250 }}>{user.username}'s profile updated!</p>
        {/if}
    </div>
</section>

<style lang="scss">
    $svelte: #ff3e00;

     .avatar {
         width: 300px;
         object-fit: cover;
         border-radius: 100%;
         //watch out experimental!... but neat fix :)
         aspect-ratio: 1 / 1;
    }

    .success {
        color: green
    }

    .submit {
        background-color: $svelte;
        color: white
    }

    section {
		margin: 0 auto;
	}

    .container {
        width: 400px;
        margin-top: 50px    ;
		text-align: center;
		font-size: 40px;
	}
</style>