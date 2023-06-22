<script lang="ts">
    export let editMode = false;
    export let onSubmit: (evt: SubmitEvent) => void;
</script>

<form class="sectional-form" class:edit-mode={editMode} on:submit={onSubmit}>
    <slot></slot>
</form>

<style>
    /* section layout */

    .sectional-form :global(section) {
        display: grid;
    }

    .sectional-form :global(aside) {
        display: none;
        padding: 1rem;
        background: #f7f7f7;
        border-bottom: 1px solid rgb(0 0 0 / 5%);
    }

    .sectional-form :global(aside:not(:empty)) {
        display: block;
    }

    @media (max-width: 639px) {
        .sectional-form :global(section.cta-row aside) {
            display: grid;
            order: 2;
        }

        .sectional-form :global(section.cta-row main) {
            order: 1;
        }
    }

    .sectional-form :global(section:not(:first-child) aside) {
        border-top: 1px solid rgb(0 0 0 / 10%);
    }

    .sectional-form :global(section:not(:first-child) main) {
        border-top: 1px solid rgb(0 0 0 / 5%);
    }

    .sectional-form :global(main) {
        padding: 1rem;
        display: grid;
        gap: 1rem;
    }

    @media (min-width: 640px) {
        .sectional-form :global(aside) {
            display: block;
        }

        .sectional-form :global(section) {
            grid-template-columns: 12rem 1fr;
        }

        .sectional-form :global(aside) {
            padding: 1rem;
            background: #f7f7f7;
            border-bottom: none;
            border-right: 1px solid rgb(0 0 0 / 5%);
        }

        .sectional-form :global(section:not(:first-child) aside) {
            border-top: 1px solid rgb(0 0 0 / 10%);
        }

        .sectional-form :global(section:not(:first-child) main) {
            border-top: 1px solid rgb(0 0 0 / 5%);
        }

        .sectional-form :global(main) {
            padding: 1rem;
            display: grid;
            gap: 1rem;
        }
    }

    @media (min-width: 960px) {
        .sectional-form :global(section) {
            grid-template-columns: 16rem 1fr;
        }
    }

    /* text styles */

    .sectional-form :global(h2) {
        margin: 0;
        font-size: 1.25rem;
    }

    .sectional-form :global(h3) {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 900;
    }

    .sectional-form :global(h4) {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 900;
    }

    /* horizontal form groups */

    .sectional-form :global(.control-group) {
        display: grid;
        gap: 1rem;
    }

    @media (min-width: 720px) {
        .sectional-form :global(.control-group) {
            display: flex;
            gap: 1rem;
        }
    }

    .sectional-form :global(.field-note) {
        margin: 0.5rem 0;
        color: rgb(0 0 0 / 50%);
        font-size: 0.9rem;
        font-weight: 600;
    }

    .sectional-form :global(.form-hint) {
        margin: 0.5rem 0;
        color: rgb(0 0 0 / 50%);
        font-size: 0.9rem;
    }

    /* override disabled forms */

    .sectional-form :global(.form-control :disabled) {
        background: none;
        outline: 1px solid rgb(0 0 0 / 5%);
        font-weight: 500;
    }

    .sectional-form :global(.form-control:has(:disabled) label) {
        color: var(--theme-accent);
        opacity: 0.75;
    }

    .sectional-form.edit-mode :global(.form-control :disabled),
    .sectional-form.edit-mode :global(.form-control:has(:disabled) label),
    .sectional-form.edit-mode :global(.checkbox-panel:disabled),
    .sectional-form.edit-mode :global(.select-list-item:disabled:not(.active)) {
        background: #f7f7f7;
    }
</style>
