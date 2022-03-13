<script lang="ts">

</script>


<section>
    <div class="container">
        <div class="field">
            <div class="control">
            <input class="input" type="text" placeholder="Username">
            </div>
        </div>
        
        <div class="field">
            <div class="control">
            <input class="input" type="text" placeholder="Password">
            </div>
        </div>

        <button class="button submit">create account</button>
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