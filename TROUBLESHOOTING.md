# SachLabel — Troubleshooting Log

A running record of real bugs hit while building SachLabel, their root causes, and
fixes. Kept for interview prep — "tell me about a challenge you faced" answers.

---

## Day 2 — Database Layer (Docker + Postgres + Prisma)

### 1. Prisma schema validation failed (P1012) — `Datetime` not recognized
- **Symptom:** `Type "Datetime" is neither a built-in type... Did you mean "DateTime"?`
- **Root cause:** Typo — lowercase `t`. Prisma types are case-sensitive.
- **Fix:** `Datetime` → `DateTime`.
- **Takeaway:** Read error messages fully — Prisma suggested the fix. Type systems
  catch typos at build time, not at 2am in production.

### 2. `Cannot find module '../generated/prisma'`
- **Symptom:** Node couldn't resolve the Prisma client import.
- **Root cause (two layers):** First a wrong relative path (`./` vs `../`). Deeper:
  Prisma 7's `prisma-client` generator output TypeScript `.ts` files, which plain
  Node/CommonJS cannot `require`.
- **Fix:** Corrected the path, then switched the generator so the client generates as
  JavaScript into `node_modules`.
- **Takeaway:** `./` = current folder, `../` = up one. Know what language your
  generated code is in — CommonJS can't import raw TypeScript.

### 3. `PrismaClientInitializationError: needs a valid PrismaClientOptions`
- **Symptom:** Client refused to construct.
- **Root cause:** Prisma 7 removed the DB URL from `schema.prisma` and expects it via
  `prisma.config.ts` or an adapter passed to the constructor. Our JS setup didn't
  provide it.
- **Fix:** Part of the decision to downgrade (see #5).

### 4. `The datasource property 'url' is no longer supported in schema files`
- **Symptom:** Adding `url = env("DATABASE_URL")` to the schema errored under Prisma 7.
- **Root cause:** Prisma 7 moved connection config out of the schema entirely — a
  breaking change from Prisma 5.
- **Fix:** Part of the downgrade.

### 5. Root cause: Prisma 7 vs a CommonJS project
- **Decision:** Downgraded to **Prisma 5.22.0** (`prisma@5`, `@prisma/client@5`),
  deleted `prisma.config.ts`, restored `url = env("DATABASE_URL")` in the datasource.
- **Takeaway (strong interview answer):** The newest version isn't always the right
  one. Prisma 7 is TypeScript-first and its config model fought a plain-JS/CommonJS
  setup. Chose a stable, well-documented version — engineering judgment over chasing
  the latest.

### 6. `Authentication failed... credentials for 'sachlabel' are not valid`
- **Symptom:** Prisma couldn't authenticate.
- **Root cause:** The Docker container wasn't running (and the client had a stale
  connection state).
- **Fix:** Started the container; restarted the server so Prisma reconnected.

### 7. `Can't reach database server at localhost:5432` (flagship bug)
- **Symptom:** Credentials correct, but the host couldn't reach the DB.
  `docker compose ps` showed `5432/tcp` instead of `0.0.0.0:5432->5432/tcp`.
- **Root cause:** The running container had no host port binding. `docker compose up -d`
  is lazy — it reused a stale container created before the port mapping existed. Clue:
  `psql` via `docker exec` worked (runs inside the container) but Prisma from the host
  failed (needs the published port).
- **Fix:** `docker compose down && docker compose up -d` to force a clean recreation.
  Data survived because it lives in the named volume `postgres_data`.
- **Takeaway:** Container port ≠ published host port. `up -d` won't apply config changes
  to an existing container — you must recreate it.

### The one-line story for an interviewer
> "Setting up my data layer, I hit a cascade of failures — a version mismatch where
> Prisma 7's TypeScript-first design broke my CommonJS project, which I resolved by
> making a deliberate downgrade to a stable version. Then a subtle Docker networking
> bug where the container ran but never published its port to the host. I diagnosed it
> by noticing psql-via-exec worked while my app didn't — which pointed straight at the
> host-to-container port mapping."

Demonstrates: version judgment, reading errors carefully, networking fundamentals.