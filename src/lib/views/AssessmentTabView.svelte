<script lang="ts">
	import { AddDamageAssessmentLogModal, AddVulnerabilityAssessmentLogModal } from '$lib/components';
	import { selectedBuilding } from '$lib/stores';

    $: loading = $selectedBuilding?.loading;
    $: building = $selectedBuilding?.building;

    $: vulnerabilityAssessmentLogs = $selectedBuilding?.vulnerabilityAssessmentLogs;
    $: damageAssessmentLogs = $selectedBuilding?.damageAssessmentLogs;

    let activeTab: 'pre' | 'post' = 'pre';
</script>

<div class="assessment-tab-view">
    <div class="tabs">
        <button class="tab" class:active={activeTab === 'pre'} on:click={() => activeTab = 'pre'}>Vulnerability</button>
        <button class="tab" class:active={activeTab === 'post'} on:click={() => activeTab = 'post'}>Damage</button>
    </div>

    {#if loading || !building}
        <div class="tab-content">
            Loading...
        </div>
    {:else if activeTab === 'pre'}
        <div class="tab-content">
            {#if vulnerabilityAssessmentLogs && vulnerabilityAssessmentLogs.length > 0}
                <div class="log-panels">
                    {#each vulnerabilityAssessmentLogs as log (log.id)}
                        <AddVulnerabilityAssessmentLogModal {building} preview={log} let:modal>
                            <button class="panel-button" on:click={modal.open}>
                                <div class="content">
                                    <div class="title">
                                        <span class="condition">{log.inspectionData.overallPresentCondition}</span>
                                        <span class="date">{log.inspectionDate.toDateString()}</span>
                                    </div>
                                    <div class="inspector">{log.inspectorName} ({log.inspectorAffiliation})</div>
                                </div>
                                <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 12H20M20 12L12 4M20 12L12 20" stroke="currentColor" stroke-linecap="square"/>
                                </svg>
                            </button>
                        </AddVulnerabilityAssessmentLogModal>
                    {/each}
                </div>
            {:else}
                <div class="logs-empty">
                    No vulnerability assessment logs yet.
                </div>
            {/if}

            <AddVulnerabilityAssessmentLogModal {building} let:modal>
                <button class="add-assessment-button" on:click={modal.open}>Add Assessment</button>
            </AddVulnerabilityAssessmentLogModal>
        </div>
    {:else}
        <div class="tab-content">
            {#if damageAssessmentLogs && damageAssessmentLogs.length > 0}
                <div class="log-panels">
                    {#each damageAssessmentLogs as log (log.id)}
                        <AddDamageAssessmentLogModal {building} preview={log} let:modal>
                            <button class="panel-button" on:click={modal.open}>
                                <div class="content">
                                    <div class="title">
                                        <span class="condition">{log.inspectionData.finalPosting}</span>
                                        <span class="date">{log.inspectionDate.toDateString()}</span>
                                    </div>
                                    <div class="inspector">{log.inspectorName} ({log.inspectorAffiliation})</div>
                                </div>
                                <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 12H20M20 12L12 4M20 12L12 20" stroke="currentColor" stroke-linecap="square"/>
                                </svg>
                            </button>
                        </AddDamageAssessmentLogModal>
                    {/each}
                </div>
            {:else}
                <div class="logs-empty">
                    No damage assessment logs yet.
                </div>
            {/if}

            <AddDamageAssessmentLogModal {building} let:modal>
                <button class="add-assessment-button" on:click={modal.open}>Add Assessment</button>
            </AddDamageAssessmentLogModal>
        </div>
    {/if}
</div>

<style>
    .assessment-tab-view {
        display: block;
        background: rgb(0 0 0 / 50%);
        color: white;
        border-radius: 0.5rem;
        overflow: hidden;
        backdrop-filter: blur(0.5rem);
        -webkit-backdrop-filter: blur(0.5rem);
    }

    .tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0 2rem;
        border-bottom: 1px solid rgb(255 255 255 / 10%);
    }

    .tabs .tab {
        display: block;
        appearance: none;
        padding: 1rem 1rem;
        margin: 0 0 -1px;

        font-size: 1rem;
        font-weight: 700;
        text-align: center;
        text-transform: uppercase;

        background: none;
        color: rgb(255 255 255 / 50%);
        border: none;
        cursor: pointer;
        transition: all 100ms ease;
    }

    .tabs .tab:hover,
    .tabs .tab:focus {
        background: rgb(255 255 255 / 2.5%);
        color: rgb(255 255 255 / 75%);
    }

    .tabs .tab.active {
        border-bottom: 1px solid rgb(255 255 255 / 100%);
        color: white;
    }

    .tab-content {
        padding: 2rem;
    }

    .logs-empty {
        opacity: 0.5;
    }

    .log-panels {
        margin: -1rem -2rem 0;
    }

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

    .panel-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 2rem;
		width: 100%;
		text-align: left;
		background: none;
		color: white;
		border: none;
		cursor: pointer;
	}

	.panel-button:hover,
	.panel-button:focus {
		background: rgb(255 255 255 / 5%);
	}

	.panel-button + :global(.panel-button::before) {
		content: "";
		position: absolute;
		top: 0;
		left: 2rem;
		right: 2rem;
		height: 1px;
		background: rgb(255 255 255 / 5%);
	}

	.panel-button .icon {
		width: 2rem;
		height: 2rem;
		color: rgb(255 255 255 / 50%);
	}

	.panel-button .title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		margin: 0 0 0.5rem;
	}

	.panel-button .condition {
		font-size: 1.2rem;
		font-weight: 700;
	}

	.panel-button .date {
		font-size: 1rem;
		font-weight: 700;
		color: rgb(255 255 255 / 50%);
	}

	.panel-button .inspector {
		font-size: 1rem;
		font-weight: 500;
		color: rgb(255 255 255 / 50%);
	}
</style>
