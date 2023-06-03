<script lang="ts">
	import type { Building } from '@prisma/client';
	import { Modal, ModalContext, SectionalForm } from '.';

    export let building: Building;

    const addVulnerabilityAssessmentLog = () => {};
</script>
<ModalContext let:modal>
    <button class="add-assessment-button" on:click={modal.open}>Add Assessment</button>
    <Modal>
        <SectionalForm onSubmit={addVulnerabilityAssessmentLog}>
            <section>
                <aside></aside>
                <main>
                    <h2>
                        {building.name}
                    </h2>
                </main>
            </section>
        </SectionalForm>
    </Modal>
</ModalContext>

<style>
    .add-assessment-button {
        display: block;
        margin: 2rem 0 0;
        padding: 1rem 1.5rem;
        background: rgb(255 255 255 / 5%);
        color: white;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: all 100ms ease;
    }

    .add-assessment-button:hover,
    .add-assessment-button:focus {
        background: rgb(255 255 255 / 10%);
    }
</style>
