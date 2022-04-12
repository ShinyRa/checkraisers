<script lang="ts">
    import { type User } from "$lib/entities/user/User";
    import UserClient from "../api/user/UserClient";
    import { fly } from 'svelte/transition';
    import Validate from "../_utils/Validate";
    import Util from "../_utils/Util";
    import { goto } from "$app/navigation";
    
        let user: Partial<User> = {email: '', username: '', password: ''}
        let messageType
        let message

        const registerUser = async() => {
            await UserClient.register(user).then((res)=>{
                messageType = Object.keys(res)[0]
                message = res[Object.keys(res)[0]]
            })
            console.log(messageType)
            if(messageType === 'success') {
                await Util.sleep(2000)
                goto('/login')
            }
        }
    
    </script>
    
    <section>
        <div class="container">
            <p>Register</p>
            <hr>    
                <div class="field">
                    <div class="control">
                    <input class="input"  type="email" placeholder="Email" bind:value={user.email} required>
                    </div>
                </div>
        
                <div class="field">
                    <div class="control">
                    <input class="input" type="text" placeholder="Username" bind:value={user.username} required>
                    </div>
                </div>
                
                <div class="field">
                    <div class="control">
                    <input class="input" type="password" placeholder="Password" bind:value={user.password} required>
                    </div>
                </div>
        
                <button class="button submit" on:click={registerUser}>create account</button>
                {#if messageType === 'error' && message }
                    <p class="error is-size-6" in:fly|local={{ y: -25, duration: 250 }}>{message}</p>
                {:else if message}
                    <p class="success is-size-6" in:fly|local={{ y: -25, duration: 250 }}>{message}</p>
                {/if}
        </div>
    </section>
    
    <style lang="scss">
        $error: #ff3e00;
        $success: green;
    
        .submit {
            background-color: $error;
            color: white
        }
        
        .error {
            color:$error
        }

        .success {
            color:$success
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