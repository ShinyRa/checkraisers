

<script lang="ts">
    import { User } from "$lib/entities/user/User";
    import { userClient } from "../api/user/userClient";
    
        let user: Partial<User> = {email: '', username: '', password: ''}

        const registerUser = async() => {
            userClient.register(user)
        }
    
    </script>
    
    <section>
        <div class="container">
    
            <p>Register</p>
            <hr>    
            <form>
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
            </form>
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