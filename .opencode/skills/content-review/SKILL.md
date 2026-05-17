---
name: content-review
description: "Use when creating, editing, or reviewing MDX content files in src/content/. Validates technical accuracy, educational value, and consistency between cases and solutions."
---

# Content Review Skill

## Purpose
Ensure all technical content in this design dojo is:
1. **Technically accurate** — no hallucinations, no outdated information
2. **Educational** — readers learn "why", not just "what"
3. **Consistent** — cases and solutions align

## When to Use
- Creating new exercise/case/solution content
- Editing existing MDX files in `src/content/`
- Reviewing content for factual errors
- Checking consistency between cases and solutions

## Technical Fact-Check Checklist

### Database Design
- [ ] Unique constraints actually prevent duplicates (check scope: exact match vs range overlap)
- [ ] If using PostgreSQL partial indexes, explain their limitations clearly
- [ ] Range overlap prevention requires application-level validation, not just DB constraints
- [ ] Logical deletion (status enum) has a clear rationale; mention GDPR/account deletion if applicable
- [ ] `cancelled_at` or equivalent exists if API returns cancellation timestamps

### Authentication & Security
- [ ] refreshToken is managed via HttpOnly Cookie, NOT localStorage
- [ ] Explain XSS risk if mentioning localStorage for tokens
- [ ] JWT expiration strategy is reasonable (short accessToken, longer refreshToken)
- [ ] Password storage uses proper hashing (bcrypt, Argon2, etc.)

### API Design
- [ ] HTTP methods match REST conventions (GET/POST/PATCH/DELETE)
- [ ] Status codes are appropriate (201 for creation, 401/403 for auth)
- [ ] Error response format is consistent and machine-readable (`code` + `message`)
- [ ] Query parameters are documented with types and constraints

### Architecture Decisions
- [ ] Every significant decision has a "why" explanation
- [ ] Trade-offs are presented with concrete examples (not just "X is better")
- [ ] Alternative technologies are mentioned with specific pros/cons
- [ ] Version numbers or "current as of" notes for rapidly changing tools

## Educational Value Checklist

### Clarity for Beginners
- [ ] No unexplained jargon; or jargon is defined on first use
- [ ] Design decisions include both the ideal and practical considerations
- [ ] Common pitfalls are highlighted (e.g., "this pattern looks correct but fails when...")
- [ ] Code examples are minimal but complete enough to understand

### Depth of Explanation
- [ ] "Why this approach?" is answered, not just "what to do"
- [ ] Multiple valid approaches are shown when they exist
- [ ] Links to official documentation or authoritative sources are provided
- [ ] Edge cases are considered (race conditions, timezone issues, etc.)

## Consistency Checklist

### Between Cases and Solutions
- [ ] API endpoints match (same paths, methods, parameter names)
- [ ] Data types align (e.g., `UUID` vs `string` used consistently)
- [ ] Query parameters are identical or solutions extend cases (never contradict)
- [ ] ER diagrams match between case and solution
- [ ] Error response formats are identical

### Naming Conventions
- [ ] File naming: kebab-case (`01-simple-reservation.mdx`)
- [ ] Frontmatter fields: `title`, `description`, `difficulty`, `order`, `tags`
- [ ] Code: camelCase for JS/TS, snake_case for SQL/DB columns

## Frontmatter Requirements

All content files MUST include:
```yaml
---
title: "Case/Solution/Exercise NN: Title"
description: "One-line summary"
difficulty: "beginner" | "intermediate" | "advanced"
order: number
tags: ["tag1", "tag2"]
verified: boolean          # Has this been fact-checked?
last_reviewed: YYYY-MM-DD  # Last review date
sources:                   # Links to authoritative references
  - https://example.com/docs
---
```

## Prohibited Patterns

1. **Hallucinated APIs**: Never invent method names, config options, or behavior
2. **Outdated names**: Use current names (Auth.js, not NextAuth.js)
3. **Over-simplified security**: Never suggest localStorage for refresh tokens
4. **Incomplete constraints**: Never claim a DB constraint prevents overlaps when it only prevents exact matches
5. **Missing trade-offs**: Never recommend a technology without explaining when NOT to use it

## Review Process

When reviewing content:
1. Check all items in the Technical Fact-Check Checklist
2. Check all items in the Educational Value Checklist
3. Check all items in the Consistency Checklist
4. If any item fails, mark `verified: false` and list issues
5. If all pass, mark `verified: true` and update `last_reviewed`

## Example of Good vs Bad

### Bad: "Use optimistic locking to prevent duplicate reservations"
- Why bad: Optimistic locking does NOT prevent duplicates in concurrent writes

### Good: "Prevent duplicates using a PostgreSQL partial unique index on (facility_id, start_time) WHERE status = 'confirmed', PLUS application-level range overlap checks. The index alone only prevents exact start_time matches, not overlapping time ranges."
- Why good: Accurate, explains limitation, provides complete solution
