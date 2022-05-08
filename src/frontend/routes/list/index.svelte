<script context="module">
	export async function load({ session }) {
		session.authenticated = session.authenticated
		if (!session.authenticated) {
			return {
				status: 302,
				redirect: '/profile'
			};
		}
		return {};
	}
</script>

<script lang='ts'>
    import { socketStore } from "$lib/logic/frontend/entities/stores/userStore";
    import { io, Socket } from "socket.io-client"


 $socketStore = io('ws://localhost:3001');

</script>

<section>
    <div class="container is-flex is-flex-direction-column">
        <p class="is-size-1 has-text-centered">Game list</p>
        <hr>
        <button class="button">Create match</button>
        <div class="table-container list">
            <table class="table ">
                <thead>
                    <th>Game list</th>
                    <th>join</th>
                </thead>
                <tbody>
                    <!-- {#each routes as { title, route }}
                        <tr>
                            <td>the big game</td>
                            <td><button class='p2 button'>join</button></td>
                        </tr>
				    {/each} -->

                </tbody>
            </table>
        </div>
        
    </div>
</section>

<style lang="scss">
    $svelte: #ff3e00;

    button{
        background-color: $svelte;
        color: white;
        border: none;
        width: auto;
    }
    
    .list{
        margin-top: 20px;
    }

    .container {
        margin-top: 50px;
	}   

    section {
		margin: 0 auto;
	}
</style>