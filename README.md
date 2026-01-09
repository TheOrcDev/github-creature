# GitHub Creature

Generate a **shareable fantasy creature card** from a GitHub profile.

<img width="1564" height="1380" alt="CleanShot 2026-01-09 at 13 46 11@2x" src="https://github.com/user-attachments/assets/c24f34b2-3e00-49b6-a78d-7a274838abdf" />

You paste a GitHub profile URL, the app fetches your GitHub stats (contributions, followers, stars), uses an AI model to **invent a creature + generate an image**, then saves it so you get a permanent page at `/<username>`. There’s also a **leaderboard** for top creatures by contributions, followers, and stars.

## Screenshot

<!-- TODO: Add one screenshot (recommended: 1200×630) -->
<!-- ![GitHub Creature screenshot](docs/screenshot.png) -->

## What you can do

- **Summon** a creature from a GitHub profile URL
- **Share** a `/<username>` link with nice social previews
- **Download** the creature card
- **Browse leaderboards** (contributions / followers / stars)

## Running locally

```bash
pnpm i
pnpm dev
```

### Environment variables

Create `.env.local` (or `.env`) with:

- **`DATABASE_URL`**: Postgres connection string (Neon)
- **`GITHUB_TOKEN`**: GitHub token for the API (to read contributions/followers)
- **`BLOB_READ_WRITE_TOKEN`**: Vercel Blob token (needed to upload generated images when running locally)
- **AI provider key**: this project uses the Vercel AI Gateway

Then open `http://localhost:3000`.
