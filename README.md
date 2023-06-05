<picture>
    <source media="(prefers-color-scheme: dark)" srcset="/static/gh-banner-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="/static/gh-banner-light.png">
    <img alt="RiskScape" src="/static/gh-banner-gray.png">
</picture>

---

![List View](/static/gh-ss-list.png)

![Building View](/static/gh-ss-bldg.png)

# Running for Development

First run:

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev -- --open
```

On subsequent runs, you only need to run `npm run dev` to start the dev server.

Re-run the prisma commands when there are new schema changes to `prisma/schema.prisma`.

## Building

To create a production build of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment

The [staging environment](https://riskscape.ndfnz.io/) was hosted on DigitalOcean using [pm2](https://github.com/Unitech/pm2) and nginx.

The general flow for setting this up on a VPS would look something like this:

```bash
git clone path/to/riskscape.git riskscape
cd riskscape

npm install
npx prisma migrate deploy
npx prisma generate
npm run build

BODY_SIZE_LIMIT=100000000 pm2 start ./build/index.js
```
