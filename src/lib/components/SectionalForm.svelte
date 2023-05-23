<script lang="ts">
    export let onSubmit: (evt: SubmitEvent) => void;
</script>

<form class="sectional-form" on:submit={onSubmit}>
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

    .sectional-form :global(aside h3) {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 900;
    }

    .sectional-form :global(main h2) {
        margin: 0;
        font-size: 1.25rem;
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
</style>
