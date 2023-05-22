<script lang="ts">
    import { ModalContext, Modal } from '.';
</script>

<section class="actions-section">
    <ModalContext let:modal>
        <button class="expand-button" on:click={modal.open} title="Submit New Building Record">
            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20" stroke="currentColor" stroke-linecap="square"/>
                <path d="M12 4L12 20" stroke="currentColor" stroke-linecap="square"/>
            </svg>
        </button>

        <Modal context={modal}>
            <h2>Submit Building Record</h2>
            
            <div>building name</div>
            <div>building contact phone</div>
            <div>building address</div>
            <div>zip code</div>
            <div>seismic zone</div>
            <div>distance from nearest fault line</div>
            <div>near source</div>
            <div>soil type</div>
        </Modal>
    </ModalContext>
</section>

<style>
    .expand-button {
        position: fixed;
        right: 2rem;
        bottom: 4rem;
        width: 4rem;
        height: 4rem;

        display: flex;
        align-items: center;
        justify-content: center;

        appearance: none;
        background: white;
        border: none;
        border-radius: 5rem;
        cursor: pointer;
        transition: background 100ms ease;
    }

    .expand-button:hover {
        background: #f0f0f0;
    }

    .icon {
        width: 2rem;
        height: 2rem;
    }
</style>
