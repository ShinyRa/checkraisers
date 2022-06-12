<script context="module">
	export async function load({ session }) {
		session.authenticated = session.authenticated;
		if (!session.authenticated) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {};
	}
</script>

<script lang="ts">
	import UserClient from '$lib/logic/clients/user/UserClient';
	import { fly } from 'svelte/transition';
	import { assets as assetsPath } from '$app/paths';
	import { userStore } from '$lib/logic/frontend/entities/stores';
	import Util from '$lib/logic/frontend/generic/Util';
	import { goto } from '$app/navigation';

	const MAXIUM_FILE_SIZE = 1500000;
	let updated;
	let user = $userStore.getUserData();
	let preview: string = `${assetsPath}/avatars/${user.profilePicture}`;

	const onFileSelected = (e) => {
		let reader = new FileReader();
		const image: File = e.target.files[0];
		if (image.size > MAXIUM_FILE_SIZE) {
			alert(
				`profile picture exceeds maxiumum file size by: ${
					image.size && ((image.size - MAXIUM_FILE_SIZE) / 1000000).toFixed(2)
				}MB`
			);
			return;
		}
		user.profilePicture = image;
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			preview = e.target.result as string;
		};
	};

	const updateProfile = async () => {
		//Refactor into URLSearchParams
		let fd = new FormData();
		fd.append('email', user.email);
		fd.append('username', user.username);
		fd.append('chips', user.chips.toString());
		if (typeof user.profilePicture !== 'string') fd.append('profilePicture', user.profilePicture);
		let res = await UserClient.update(fd);
		userStore.update((currentUser) => {
			currentUser.setUserData(res['value']);
			return currentUser;
		});
		updated = res['ok'];
		await Util.sleep(1000);
		goto('/lobby');
	};
</script>

<section style={'background-image: url(' + assetsPath + 'wall-tile.jpg);'}>
	<div class="nes-container with-title">
		<p class="title">profile</p>
		{#if user}
			<div class="nes-field">
				<label for="name_field">username</label>
				<input
					class="nes-input"
					type="text"
					name="username"
					placeholder="username"
					bind:value={user.username}
					required
				/>
			</div>

			<div class="picture">
				<img
					class="avatar"
					src={preview}
					alt="no_profilepicture"
					style="image-rendering: pixelated;"
				/>
			</div>
			<label class="nes-btn">
				<span>Upload profile picture...</span>
				<input
					name="profilePicture"
					type="file"
					accept=".jpg, .jpeg, .png"
					on:change={(e) => onFileSelected(e)}
				/>
			</label>
			<button type="button submit" class="nes-btn is-primary" on:click={updateProfile}
				>save changes</button
			>

			{#if updated}
				<div class="messages">
					<span class="nes-text is-success" in:fly|local={{ y: -25, duration: 250 }}>
						changes have been saved!
					</span>
				</div>
			{/if}
		{:else}
			<p>loading...</p>
		{/if}
	</div>
</section>

<style lang="scss">
	section {
		height: 100vh;
		width: 100vw;
		margin: 0 auto;
		image-rendering: pixelated;
		background-size: 300px;
	}
	.picture {
		margin: 0 auto;
		display: flex;
		justify-content: center;
	}
	.avatar {
		width: 300px;
		border-radius: 100%;
		//watch out experimental!... but neat fix :)
		aspect-ratio: 1 / 1;
	}

	.nes-container {
		max-width: 725px;
		margin: 125px auto;
		background-color: white;
	}

	.nes-field {
		padding: 8px 15px;
	}

	.messages {
		text-align: center;
		width: 100%;
	}

	.nes-btn {
		margin: 35px 0px;
		width: 100%;
	}
</style>
