<script lang="ts">
	import { onMount } from 'svelte';
	import type { Building } from '@prisma/client';
	import { Button, CheckboxPanel, ImageUploader, Input, Modal, ModalContext, SectionalForm, Select, TextArea } from '.';
	import { defaultInspectionScope, defaultDamageAssessmentLogData, selectBuilding, type AssessmentLogData, type DamageAssessmentLog, type ImageData } from '$lib/stores';
	import { BUILDING_DAMAGE_INDICATORS, BUILDING_DAMAGE_LEVELS, BUILDING_MATERIALS, BUILDING_SAFETY_EVALUATION_CONDITIONS } from '$lib/helpers';
	import prettyMilliseconds from 'pretty-ms';
	import { slide } from 'svelte/transition';

    export let building: Building;
    export let preview: DamageAssessmentLog | null = null;

    let modalContext: ModalContext;

    let log: Partial<AssessmentLogData> = { type: 'post' };
    
    let inspectionScope = defaultInspectionScope;
    let data = defaultDamageAssessmentLogData;

    let activeIndicatorsDescription = '';

    let formCompletionStart = new Date().getTime();

    let images: ImageData[] = [];

    const resetForm = () => {
        if (preview) {
            log = preview;
            inspectionScope = preview.inspectionScope;
            data = preview.inspectionData;
            activeIndicatorsDescription = '';
            images = preview.images;
        } else {
            log = { type: 'post' };
            inspectionScope = defaultInspectionScope;
            data = defaultDamageAssessmentLogData;
            activeIndicatorsDescription = '';

            formCompletionStart = new Date().getTime();

            images = [];
        }
    }

    onMount(() => {
        resetForm();
    });

    let error = '';
    let saving = false;

    const addDamageAssessmentLog = async () => {
        if (saving) return;

        if (!confirm('Are you sure you want to submit this damage assessment? You won\'t be able to update or delete this entry once submitted.')) return;

        saving = true;

        // prep payload
        const payload: Partial<DamageAssessmentLog> = {
            ...log,
            formCompletionDuration: (new Date().getTime()) - formCompletionStart,
            inspectionScope,
            inspectionData: {
                ...data
            },
            imageIds: images.map(img => img.id)
        };

        const response = await fetch(`/buildings/${building.id}/addDamageAssessmentLog`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        const res = await response.json();

        if (response.ok) {
            resetForm();
            modalContext.modal.close();
            setTimeout(() => selectBuilding(building, true), 600);
        } else {
            error = res.message || 'Failed to submit damage assessment.';
        }

        saving = false;
    };

    const cancel = () => {
        if (preview || confirm('Are you sure you want to cancel this submission? All unsaved data will be lost.')) {
            resetForm();
            modalContext.modal.close();
        }
    }

    $: disabled = preview != null || saving;
</script>

<ModalContext bind:this={modalContext} let:modal actionRequired={preview == null}>
    <slot {modal}></slot>
    <Modal>
        <SectionalForm onSubmit={addDamageAssessmentLog}>
            <section>
                <aside>
                    <button type="button" class="cancel-button" on:click={cancel}>
                        <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 12L4 12M4 12L12 20M4 12L12 4" stroke="currentColor" stroke-linecap="square" stroke-width="2" />
                        </svg>
                        {preview == null ? 'Cancel' : 'Dismiss'}
                    </button>
                </aside>
                <main>
                    <h2>{building.name}</h2>
                    {#if preview}
                        <div class="subtitle">
                            <strong>{log.inspectionDate?.toDateString()}</strong>
                            <span>{prettyMilliseconds(log.formCompletionDuration || 0)}</span>
                        </div>
                    {/if}
                </main>
            </section>
            <section>
                <aside><h3>Inspection Log</h3></aside>
                <main>
                    <Input label="Inspector Name" bind:value={log.inspectorName} placeholder="Inspector Name" required {disabled} />
                    <div class="control-group">
                        <Input label="Affiliation" bind:value={log.inspectorAffiliation} placeholder="Affiliation" required {disabled} />
                        <Input label="Designation" bind:value={log.inspectorDesignation} placeholder="Designation" required {disabled} />
                    </div>

                    <h4>Extent of Review</h4>
                    <div class="control-group">
                        <Select label="Exterior" bind:value={inspectionScope.exterior} required {disabled}>
                            <option value="Partial">Partial</option>
                            <option value="All Sides">All Sides</option>
                            <option value="Aerial">Aerial</option>
                        </Select>
                        <Select label="Interior" bind:value={inspectionScope.interior} required {disabled}>
                            <option value="None">None</option>
                            <option value="Visible">Visible</option>
                            <option value="Entered">Entered</option>
                        </Select>
                    </div>

                    <h4>Drawings Reviewed</h4>
                    <div class="control-group">
                        <CheckboxPanel bind:checked={inspectionScope.drawings.structuralPlans} {disabled}>
                            Structural Plans
                        </CheckboxPanel>
                        <CheckboxPanel bind:checked={inspectionScope.drawings.architecturalPlans} {disabled}>
                            Architectural Plans
                        </CheckboxPanel>
                    </div>
                    <Input label="Other Drawings" bind:value={inspectionScope.drawings.other} placeholder="Leave blank if no other drawings reviewed." {disabled} />
                </main>
            </section>
            <section>
                <aside><h3>Damage Assessment</h3></aside>
                <main>
                    <div class="control-group">
                        <Select label="Building Material" bind:value={data.buildingMaterial} required {disabled} onChange={() => {
                            data.buildingStructuralType = '';
                        }}>
                            <option value="" disabled>-</option>
                            {#each Object.entries(BUILDING_MATERIALS) as [value, mat]}
                                <option {value}>{mat.name}</option>
                            {/each}
                        </Select>
                        <Select label="Structural Type" bind:value={data.buildingStructuralType} required {disabled}>
                            <option value="" disabled>-</option>
                            {#each Object.entries(BUILDING_MATERIALS[data.buildingMaterial]?.structuralTypes ?? {}) as [value, text]}
                                <option {value}>{text}</option>
                            {/each}
                        </Select>
                    </div>

                    {#if data.buildingMaterial}
                        <hr />

                        <div class="prose">
                            <h4>Damage Indicators - {BUILDING_MATERIALS[data.buildingMaterial].name}</h4>
                            <p class="form-hint">Please specify observations for each key area below. Click "Possible damage indicators" to view a list of hints for the selected building material type and key location.</p>
                        </div>

                        <div class="damage-indicators">
                            {#each Object.entries(BUILDING_DAMAGE_INDICATORS[data.buildingMaterial]) as [id, indicator]}
                                <hr />
                                <TextArea label={indicator.area} bind:value={data.damageIndicators[id]} placeholder="Observations" required {disabled} />
                                <div class="possible-indicators">
                                    <button type="button" class="toggle" on:click={() => {
                                        if (activeIndicatorsDescription === id) activeIndicatorsDescription = '';
                                        else activeIndicatorsDescription = id;
                                    }}>
                                        <strong>Possible damage indicators</strong>
                                        <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 9L12 17L4 9" stroke="currentColor" stroke-linecap="square"/>
                                        </svg>
                                    </button>
                                    {#if activeIndicatorsDescription === id}
                                        <div class="content" transition:slide|local>
                                            <ul>
                                                {#each indicator.indicators as desc}
                                                    <li>{desc}</li>
                                                {/each}
                                            </ul>
                                        </div>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <hr />

                        <div class="prose">
                            <h4>Damage Indicators</h4>
                            <p class="form-hint">Please select a building material above to show the list of key areas for observation.</p>
                        </div>
                    {/if}
                </main>
            </section>
            <section>
                <aside><h3>Damage Level Estimation</h3></aside>
                <main>
                    <div>    
                        {#if data.buildingMaterial && data.buildingStructuralType}
                            <h4>Damage Level Indicators - {BUILDING_MATERIALS[data.buildingMaterial].name} ({data.buildingStructuralType})</h4>
                            <div class="damage-level-indicators">
                                {#each Object.entries(
                                    (
                                        data.buildingStructuralType in BUILDING_DAMAGE_LEVELS[data.buildingMaterial] ?
                                        BUILDING_DAMAGE_LEVELS[data.buildingMaterial][data.buildingStructuralType] :
                                        BUILDING_DAMAGE_LEVELS[data.buildingMaterial]['default']
                                    ) ?? {}
                                ) as [level, description]}
                                    <p><strong>{level}</strong></p>
                                    <p>{description}</p>
                                {/each}
                            </div>
                        {:else}
                            <h4>Damage Level Indicators</h4>
                            <p class="form-hint">Please specify the building material & type above to show relevant damage level indicators.</p>
                        {/if}
                    </div>

                    <hr />

                    <div class="damage-level-estimation">
                        <h4>Damage Level Estimation</h4>
                        <p class="form-hint">Please choose an estimated damage level based on the indicators above.</p>
                        <Select label="Estimated Damage" bind:value={data.damageLevel} required {disabled}>
                            <option value="Negligible-Slight">Negligible-Slight</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Extensive">Extensive</option>
                            <option value="Complete">Complete</option>
                        </Select>
                    </div>
                </main>
            </section>
            <section>
                <aside><h3>Safety Evaluation</h3></aside>
                <main>
                    <h4>Observed Conditions</h4>

                    <div class="safety-eval-conditions">
                        {#each Object.entries(BUILDING_SAFETY_EVALUATION_CONDITIONS) as [id, condition]}
                            <div class="safety-eval-condition">
                                <div class="condition">
                                    <p>{condition.name}</p>
                                    {#if condition.getRemarks(data.safetyEvaluation[id])}
                                        <p class="text-critical">({condition.getRemarks(data.safetyEvaluation[id])})</p>
                                    {/if}
                                </div>

                                <div class="input">
                                    <Select bind:value={data.safetyEvaluation[id]} required {disabled}>
                                        <option value="None">None</option>
                                        <option value="Slight">Slight</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Severe">Severe</option>
                                    </Select>
                                </div>
                            </div>
                        {/each}
                    </div>
                </main>
            </section>
            <section>
                <aside><h3>Final Posting</h3></aside>
                <main>
                    <div>
                        <Select label="Final Posting" bind:value={data.finalPosting} required {disabled}>
                            <option value="INSPECTED">Inspected</option>
                            <option value="RESTRICTED USE">Restricted Use</option>
                            <option value="UNSAFE">Unsafe</option>
                        </Select>
                    </div>
                </main>
            </section>
            <section>
                <aside><h3>Further Actions</h3></aside>
                <main>
                    <CheckboxPanel bind:checked={data.recommendations.barricadesRecommended} {disabled}>
                        Barricades
                    </CheckboxPanel>
                    {#if data.recommendations.barricadesRecommended}
                        <Input label="Barricades" bind:value={data.recommendations.barricadesRemarks} placeholder="Please specify areas" required {disabled} />
                    {/if}

                    <hr />

                    <h4>Detailed Evaluation Recommendation</h4>

                    <div class="control-group">
                        <CheckboxPanel bind:checked={data.recommendations.detailedEvaluationsRecommended.structural} {disabled}>
                            Structural
                        </CheckboxPanel>
                        <CheckboxPanel bind:checked={data.recommendations.detailedEvaluationsRecommended.geotechnical} {disabled}>
                            Geotechnical
                        </CheckboxPanel>
                    </div>
                    <Input label="Other" bind:value={data.recommendations.detailedEvaluationsRecommended.other} placeholder="Other recommended detailed evaluation" {disabled} />

                    <hr />

                    <TextArea label="Other Comments" bind:value={data.generalRemarks} placeholder="Other comments/recommendations" {disabled} />
                </main>
            </section>
            <section>
                <aside><h3>Image References</h3></aside>
                <main>
                    <ImageUploader bind:images preview={preview != null} />
                </main>
            </section>
            <section>
                <aside><h3>Contact Details</h3></aside>
                <main>
                    <Input label="Contact person/s in-charge" bind:value={log.contactName} required {disabled} />
                    <div class="control-group">
                        <Input label="Contact number/s" bind:value={log.contactPhone} required {disabled} />
                        <Input label="Contact email" bind:value={log.contactEmail} required {disabled} />
                    </div>
                </main>
            </section>
            {#if preview == null}
                <section class="cta-row">
                    <aside>
                        <Button secondary onClick={cancel}>Cancel</Button>
                    </aside>
                    <main>
                        {#if error}
                            <div class="error">{error}</div>
                        {/if}
                        <Button type="submit" disabled={saving}>Submit Damage Assessment</Button>
                    </main>
                </section>
            {:else}
                <section>
                    <aside></aside>
                    <main>
                        <div class="button-group right">
                            <Button onClick={cancel}>Dismiss</Button>
                        </div>
                    </main>
                </section>
            {/if}
        </SectionalForm>
    </Modal>
</ModalContext>

<style>
    .subtitle {
        margin: -0.5rem 0 0;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
        color: var(--theme-accent);
        opacity: 0.5;
    }

    .cancel-button {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin: -0.33rem 0;
        padding: 0.5rem 0.5rem;
        padding-right: 0.75rem;
        background: none;
        border: none;
        border-radius: 0.25rem;
        outline: none;
        color: var(--theme-accent);
        font-weight: 700;
        cursor: pointer;
    }

    .cancel-button .icon {
        width: 1rem;
        height: 1rem;
    }

    .cancel-button:hover,
    .cancel-button:focus {
        background: var(--theme-accent);
        color: white;
    }

    .error {
        color: var(--theme-error);
        font-weight: 700;
    }

    .possible-indicators {
        display: block;
        font-size: 0.9rem;
    }

    .possible-indicators .toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0;
        width: 100%;
        text-align: left;
        background: none;
        color: var(--theme-accent);
        border: none;
        cursor: pointer;
    }

    .possible-indicators .toggle .icon {
        display: block;
        width: 1rem;
        height: 1rem;
    }

    .possible-indicators .content ul {
        padding: 0 2rem 1rem;
        margin: 0;
    }

    .damage-indicators hr {
        margin: 0 0 1rem;
    }

    .damage-level-indicators {
        display: grid;
        font-size: 0.9rem;
        margin-top: 1rem;
    }

    @media (min-width: 480px) {
        .damage-level-indicators {
            grid-template-columns: 9rem 1fr;
            column-gap: 1rem;
            row-gap: 0.5rem;
        }
    }

    .damage-level-indicators p {
        margin: 0.5rem 0;
    }

    .damage-level-indicators p strong {
        color: rgb(0 0 0 / 50%);
    }

    .safety-eval-conditions {
        display: grid;
        gap: 1rem;
    }

    .safety-eval-condition .condition {
        font-size: 0.9rem;
        font-weight: 500;
    }

    .safety-eval-condition .condition p {
        margin: 0.25rem 0;
    }

    @media (min-width: 320px) {
        .safety-eval-condition {
            display: grid;
            grid-template-columns: 1fr 8rem;
            align-items: center;
            gap: 1rem;
        }
    }

    @media (min-width: 480px) {
        .safety-eval-condition {
            grid-template-columns: 1fr 12rem;
        }
    }

    .safety-eval-condition :global(.form-control select) {
        line-height: 2.5rem;
    }

    .safety-eval-condition :global(.form-control .icon) {
        top: 0.75rem;
    }

    .text-critical {
        color: #C53333;
    }
</style>
