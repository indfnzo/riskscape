<script lang="ts">
    import { v4 as uuidv4 } from 'uuid';
    import type { ImageData } from '$lib/stores';

    export let images: ImageData[] = [];
    export let preview = false;

    let pendingImages: { id: string, src: string }[] = [];
    let fileInput: HTMLInputElement;

    const onFileInputUpdated = async (evt: Event) => {
        const files = (evt.target as HTMLInputElement)?.files;
        if (!files || files.length === 0) return;

        const promises = [];
        
        for (const file of files) {
            if (!file.type.startsWith('image')) continue;

            const pendingImage = {
                id: uuidv4(),
                src: URL.createObjectURL(file),
            };
            pendingImages = [...pendingImages, pendingImage];

            promises.push(uploadImage(file, pendingImage.id));
        }

        await Promise.all(promises);
    }

    const uploadImage = async (file: File, pendingImageId: string) => {
        const formData = new FormData();
        formData.set('image', file);

        const response = await fetch('/images/new', {
            method: 'POST',
            body: formData,
        });
        const image = await response.json();

        // swap pendingImage w/ image
        const i = pendingImages.findIndex(x => x.id === pendingImageId);
        if (i >= 0) {
            pendingImages.splice(i, 1);
            pendingImages = [...pendingImages];
        }

        images = [...images, image];
    }

    const spliceImage = (img: ImageData) => {
        const i = images.findIndex(x => x.id === img.id);
        if (i >= 0) {
            images.splice(i, 1);
            images = [...images];
        }
    }
</script>

<div class="image-uploader">
    {#if preview}
        {#if images.length === 0 && pendingImages.length === 0}
            <p class="form-hint">No reference images uploaded.</p>
        {:else}
            <div class="images">
                {#each images as image}
                    <a class="img-thumb" href="/images/{image.id}/{image.fileName}" target="_blank">
                        <img src="/images/{image.id}/{image.fileName}" alt={image.fileName} />
                    </a>
                {/each}
            </div>
        {/if}
    {:else}
        <button type="button" class="drop-area" on:click={() => fileInput.click()}>
            <div class="text">Drop images or click here to upload.</div>
        </button>
        <input class="file-input" bind:this={fileInput} type="file" accept="image/*" multiple on:change={onFileInputUpdated} />

        {#if images.length === 0 && pendingImages.length === 0}
            <p class="form-hint">No images uploaded yet.</p>
        {:else}
            <div class="images">
                {#each images as image}
                    <a class="img-thumb" href="/images/{image.id}/{image.fileName}" target="_blank">
                        <img src="/images/{image.id}/{image.fileName}" alt={image.fileName} />
                        <button type="button" class="remove-img" on:click|preventDefault={() => spliceImage(image)}>
                            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 18L18 6" stroke="currentColor"/>
                                <path d="M6 6L18 18" stroke="currentColor"/>
                            </svg>
                        </button>
                    </a>
                {/each}
                {#each pendingImages as image}
                    <div class="img-thumb pending">
                        <img src={image.src} alt="" />
                        <svg class="spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 12C21 10.0188 20.3462 8.09295 19.1402 6.52115C17.9341 4.94935 16.243 3.81945 14.3293 3.30667C12.4156 2.7939 10.3862 2.92691 8.55583 3.68509C6.72543 4.44326 5.19635 5.78423 4.20575 7.5" stroke="currentColor"/>
                            <path d="M2.99996 12C2.99996 13.9812 3.6537 15.9071 4.85978 17.4788C6.06586 19.0506 7.75689 20.1806 9.67059 20.6933C11.5843 21.2061 13.6137 21.0731 15.4441 20.3149C17.2745 19.5567 18.8036 18.2158 19.7942 16.5" stroke="currentColor"/>
                            <path d="M9.20581 7.5L4.20581 7.5L4.20581 2.5" stroke="currentColor"/>
                            <path d="M14.7942 16.5L19.7942 16.5L19.7942 21.5" stroke="currentColor"/>
                        </svg>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</div>


<style>
    .drop-area {
        display: block;
        width: 100%;
        padding: 2rem;
        background: none;
        color: rgb(0 0 0 / 50%);
        border: 1px dashed rgb(0 0 0 / 50%);
        border-radius: 0.5rem;
        text-align: center;
        cursor: pointer;
    }

    .drop-area .text {
        color: rgb(0 0 0 / 50%);
    }

    .file-input {
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        opacity: 0.01;
        overflow: hidden;
    }

    .images {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 1rem 0;
    }

    .img-thumb {
        position: relative;
        display: block;
        width: 4rem;
        height: 4rem;
        border: 1px solid rgb(0 0 0 / 25%);
        border-radius: 0.5rem;
    }

    .img-thumb.pending::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgb(0 0 0 / 50%);
    }

    .img-thumb.pending .spinner {
        position: absolute;
        left: 1rem;
        top: 1rem;
        display: block;
        width: 2rem;
        height: 2rem;
        color: white;
        z-index: 1;
        animation: img-thumb-spin 1s linear infinite;
    }
    
    @keyframes img-thumb-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
    }

    .img-thumb:hover,
    .img-thumb:focus {
        border-color: rgb(0 0 0 / 50%);
    }

    .img-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0.5rem;
    }

    .img-thumb .remove-img {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: -0.5rem;
        top: -0.5rem;
        width: 1.5rem;
        height: 1.5rem;
        padding: 0;
        margin: 0;
        background: black;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: transform 100ms ease;
    }

    .img-thumb:not(:hover) .remove-img {
        transform: scale(0.75);
    }

    .img-thumb .remove-img .icon {
        width: 1rem;
        height: 1rem;
    }
</style>