<script lang="ts">
	import { Logo } from "$lib/components";
</script>

<section class="header-view">
    <div class="left">
        <Logo />
        <h1>
            RiskScape
            <small>Seismic Vulnerability & Damage Assessment</small>
        </h1>
    </div>

    <img style="height: 3rem;" src="/aff.png" alt="Affiliations">
</section>

<style>
    .header-view {
        position: fixed;
        left: 2rem;
        right: 2rem;
        top: 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: white;
    }

    .left {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    h1 {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0;
        font-size: 1.25rem;
        font-weight: 900;
    }

    @media (max-width: 639px) {
        h1 {
            display: none;
        }
    }

    h1 small {
        display: block;
        font-size: 0.8rem;
        text-transform: uppercase;
        opacity: 0.5;
    }
</style>
