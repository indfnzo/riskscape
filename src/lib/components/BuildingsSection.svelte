<section class="buildings-section">
    <div class="buildings-search">
        <input type="text" name="search" placeholder="Search buildings..." />
        <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10.5" cy="10.5" r="8.5" stroke="white"/>
            <path d="M22 22L16.5 16.5" stroke="white"/>
        </svg>
    </div>
</section>

<style>
    .buildings-section {
        position: fixed;
        left: 2rem;
        right: 2rem;
        top: 8rem;

        background: rgb(0 0 0 / 50%);
        border-radius: 5rem;
        backdrop-filter: blur(5px);
    }

    @media (min-width: 641px) {
        .buildings-section {
            right: auto;
            width: 32rem;
        }
    }

    .buildings-search {
        position: relative;
    }

    input {
        display: block;
        width: calc(100% - 6rem);
        appearance: none;
        padding: 1rem 2rem;
        padding-right: 4rem;
        background: none;
        border: none;
        font-size: 1.25rem;
        font-family: inherit;
        color: white;
        outline: none;
    }

    .icon {
        position: absolute;
        top: 1rem;
        right: 1.5rem;
        opacity: 0.25;
        pointer-events: none;
    }
</style>
