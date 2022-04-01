<script lang="ts">
    import { session } from '$app/stores'
    import { User } from '$lib/entities/user/User';
    import { onMount } from 'svelte';
    import UserClient from '../api/user/UserClient';

    const MAXIUM_FILE_SIZE = 1500000
    let profile = $session
    let user: Partial<User> = {
        email: profile['email'], 
        username: profile['username'], 
        chips: profile['chips'], 
        profilePicture: profile['profilePicture']
    }

    onMount(() => {
        $session
	});

    const onFileSelected =(e)=>{
        let image = e.target.files[0];
        if(image.size > MAXIUM_FILE_SIZE){
            alert(`profile picture exceeds maxiumum file size by: ${image.size && ((image.size - MAXIUM_FILE_SIZE)/1000000).toFixed(2)}MB`)
            return
        }
        user.profilePicture = e.target.files[0]
        console.log(user.profilePicture)
    }

    const updateProfile = async() => {
        UserClient.update(user).then((res) => {
                session.set(res['value'])
            })
    }
</script>

<section>
    <div class="container">

        <p>Profile</p>
        <hr>         
            <div class="field">
                <div class="control">
                <input class="input" type="text" placeholder="username" bind:value={user.username} required>
                </div>
            </div>
    
            <div class="field">
                <div class="control">
                <input class="input" type="number" placeholder="amount of chips" bind:value={user.chips} required>
                </div>
            </div>
            <div>

            <div class="picture">
                <!--<img class="avatar" src={user.profilePicture} alt='no_profilepicture'/>-->
                <input type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)}>
            </div>

        <button class="button submit" on:click={updateProfile}>Update Account</button>
    </div>
</section>

<style lang="scss">
    $svelte: #ff3e00;

    // .avatar {
    //     width: 300px;
    //     object-fit: cover;
    //     border-radius: 100%;
    //     //watch out experimental!... but neat fix :)
    //     aspect-ratio: 1 / 1;
    // }

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