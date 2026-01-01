# GitHub Creature

Generate a **shareable fantasy creature card** from a GitHub profile.

You paste a GitHub profile URL, the app fetches your GitHub stats (contributions, followers, stars), uses an AI model to **invent a creature + generate an image**, then saves it so you get a permanent page at `/<username>`. There’s also a **leaderboard** for top creatures by contributions, followers, and stars.

## Screenshot

<!-- TODO: Add one screenshot (recommended: 1200×630) -->
<!-- ![GitHub Creature screenshot](docs/screenshot.png) -->

## What you can do

- **Summon** a creature from a GitHub profile URL
- **Share** a `/<username>` link with nice social previews
- **Download** the creature card
- **Browse leaderboards** (contributions / followers / stars)

## Running locally (short)

```bash
pnpm install
pnpm dev
```

### Environment variables

Create `.env.local` (or `.env`) with:

- **`DATABASE_URL`**: Postgres connection string (used by Drizzle)
- **`GITHUB_TOKEN`**: GitHub token for the GraphQL API (to read contributions/followers)
- **`BLOB_READ_WRITE_TOKEN`**: Vercel Blob token (needed to upload generated images when running locally)
- **AI provider key**: this project uses the Vercel AI SDK (`ai`) with Gemini model IDs (`google/gemini-2.5-flash` + `google/gemini-2.5-flash-image`). Configure the appropriate API key for your setup (see [Vercel AI SDK docs](https://sdk.vercel.ai/docs)).

Then open `http://localhost:3000`.
