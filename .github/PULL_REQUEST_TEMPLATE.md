## Content Change Checklist

<!-- For content changes (MDX files in src/content/) -->

### Technical Accuracy
- [ ] Database constraints are correctly described (partial indexes, range overlaps, etc.)
- [ ] Authentication/security practices follow current best practices (HttpOnly cookies, not localStorage for refresh tokens)
- [ ] API design uses appropriate HTTP methods and status codes
- [ ] No hallucinated APIs, method names, or config options
- [ ] Technology names are current (e.g., Auth.js not NextAuth.js)

### Educational Value
- [ ] "Why" is explained, not just "what"
- [ ] Trade-offs are presented with concrete examples
- [ ] Common pitfalls and edge cases are mentioned
- [ ] Beginner-friendly: no unexplained jargon

### Consistency
- [ ] Cases and solutions are aligned (API specs, types, ER diagrams)
- [ ] Error response formats match across files
- [ ] Naming conventions are consistent (kebab-case files, camelCase code)

### Frontmatter
- [ ] `title`, `description`, `difficulty`, `order`, `tags` are present
- [ ] `verified` is set to `true` if fact-checked, `false` if pending
- [ ] `last_reviewed` is updated to today's date if fact-checked
- [ ] `sources` includes links to authoritative documentation

### Verification
- [ ] Content has been fact-checked against official documentation
- [ ] Code examples were verified to be syntactically correct
- [ ] External links are valid (not 404)

## Description

<!-- Describe what changed and why -->

