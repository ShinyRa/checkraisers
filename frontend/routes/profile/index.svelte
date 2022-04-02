<script lang="ts">
    import { session } from '$app/stores'
    import { User } from '$lib/entities/user/User';
    import { onMount } from 'svelte';
    import UserClient from '../api/user/UserClient';
    import Util from '../_utils/Util';

    const MAXIUM_FILE_SIZE = 1500000
    let imagePreview

    let user: Partial<User> = {
        email: $session['email'],
        username: $session['username'], 
        chips: $session['chips'], 
        profilePicture: $session['profilePicture']
    }

    onMount(() => {
        $session
	});

    const onFileSelected =(e)=>{
        let reader = new FileReader()
        const image = e.target.files[0]
        if(image.size > MAXIUM_FILE_SIZE){
            alert(`profile picture exceeds maxiumum file size by: ${image.size && ((image.size - MAXIUM_FILE_SIZE)/1000000).toFixed(2)}MB`)
            return
        }
        user.profilePicture = image
        reader.readAsDataURL(image);
        reader.onload = (e) => {
                imagePreview = e.target.result
            };
    }

    const updateProfile = () => {
        //Refactor into URLSearchParams
        let fd = new FormData()
        fd.append('email', user.email)
        fd.append('username', user.username)
        fd.append('chips', user.chips.toString())
        fd.append('profilePicture', user.profilePicture)
        UserClient.update(fd).then((res) => {
                res['value']['profilePicture'] = `data:image/png;base64,${Util.binaryToBase64Conversion(res['value']['profilePicture'].data)}`;
                session.set(res['value'])
            })
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
            
            {#if typeof user.profilePicture === 'string'}
                <img class="avatar" src={user.profilePicture} alt='no_profilepicture'/>
            {:else}
                <img class="avatar" src={imagePreview} alt='no_profilepicture'/>
            {/if}

            <input name="profilePicture" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)}>
        
        </div>
        <button class="button submit" on:click={updateProfile}>Update Account</button>
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