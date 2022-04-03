<script lang="ts">
    import { type User } from "$lib/entities/user/User";
import UserClient from "../api/user/UserClient";
    
        let user: Partial<User> = {email: '', username: '', password: ''}

        const registerUser = async() => {
            UserClient.register(user)
        }
    
    </script>
    
    <section>
        <div class="container">
    
            <p>Register</p>
            <hr>    
                <div class="field">
                    <div class="control">
                    <input class="input" type="text" placeholder="Email" bind:value={user.email} required>
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