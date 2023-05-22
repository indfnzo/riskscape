<script lang="ts">
	import { Logo } from ".";
</script>

<section class="logo-section">
    <div class="left">
        <Logo />
        <h1>
            RiskScape
            <small>Seismic Vulnerability & Damage Assessment</small>
        </h1>
    </div>

    <img src="/aff.png" alt="Affiliations">
</section>

<style>
    .logo-section {
        position: fixed;
        left: 2rem;
        right: 2rem;
        top: 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: white;
    }

    .logo-section .left {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .logo-section h1 {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0;
        font-size: 1.25rem;
        font-weight: 900;
    }

    @media (max-width: 640px) {
        .logo-section h1 {
            display: none;
        }
    }

    .logo-section h1 small {
        display: block;
        font-size: 0.8rem;
        text-transform: uppercase;
        opacity: 0.5;
    }
</style>
