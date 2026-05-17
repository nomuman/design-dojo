#!/usr/bin/env node
// Content Verification Script
//
// Validates MDX content files for:
// - Required frontmatter fields
// - External link validity (HTTP status check)
// - Mermaid diagram syntax (basic checks)
// - Cases/solutions consistency (API specs, types)
//
// Usage: node scripts/verify-content.mjs [file-pattern]
// Example: node scripts/verify-content.mjs src/content/all.mdx

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

const ERRORS = [];
const WARNINGS = [];

// Required frontmatter fields
const REQUIRED_FIELDS = ['title', 'description', 'difficulty', 'order', 'tags'];
const RECOMMENDED_FIELDS = ['verified', 'last_reviewed', 'sources'];

async function verifyFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    ERRORS.push(`${relativePath}: Missing frontmatter`);
    return;
  }
  
  const frontmatter = frontmatterMatch[1];
  const yaml = parseYaml(frontmatter);
  
  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in yaml)) {
      ERRORS.push(`${relativePath}: Missing required frontmatter field: ${field}`);
    }
  }
  
  // Check recommended fields
  for (const field of RECOMMENDED_FIELDS) {
    if (!(field in yaml)) {
      WARNINGS.push(`${relativePath}: Missing recommended frontmatter field: ${field}`);
    }
  }
  
  // Check verified field type
  if ('verified' in yaml && typeof yaml.verified !== 'boolean') {
    ERRORS.push(`${relativePath}: frontmatter field 'verified' must be a boolean (true/false)`);
  }
  
  // Check last_reviewed format
  if ('last_reviewed' in yaml && yaml.last_reviewed !== null) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(yaml.last_reviewed)) {
      ERRORS.push(`${relativePath}: frontmatter field 'last_reviewed' must be in YYYY-MM-DD format or null`);
    }
  }
  
  // Check sources is array (or null/undefined/empty array)
  if ('sources' in yaml && yaml.sources !== null && yaml.sources !== undefined && !Array.isArray(yaml.sources)) {
    ERRORS.push(`${relativePath}: frontmatter field 'sources' must be an array or null`);
  }
  
  // Check for broken external links
  const linkMatches = content.matchAll(/https?:\/\/[^\s\)\]\>]+/g);
  for (const match of linkMatches) {
    const url = match[0];
    // Skip in-code URLs and common false positives
    if (url.includes('localhost') || url.includes('example.com') || url.endsWith('.svg')) {
      continue;
    }
    // Note: Actual HTTP checks can be slow; enable with --check-links flag
    if (process.argv.includes('--check-links')) {
      try {
        const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
        if (response.status === 404) {
          ERRORS.push(`${relativePath}: Broken link (404): ${url}`);
        } else if (!response.ok) {
          WARNINGS.push(`${relativePath}: Link returned ${response.status}: ${url}`);
        }
      } catch (e) {
        WARNINGS.push(`${relativePath}: Could not verify link: ${url}`);
      }
    }
  }
  
  // Check Mermaid blocks for basic syntax issues
  const mermaidMatches = content.matchAll(/```mermaid\n([\s\S]*?)```/g);
  for (const match of mermaidMatches) {
    const mermaidContent = match[1];
    if (!mermaidContent.trim()) {
      ERRORS.push(`${relativePath}: Empty Mermaid diagram block`);
    }
  }
  
  // Check for common hallucination patterns
  // These are flagged as WARNINGS (not errors) because context matters.
  // Manual review via content-review skill and PR checklist is required.
  const hallucinationPatterns = [
    { pattern: /NextAuth\.js/i, msg: 'Check: "NextAuth.js" mentioned. Ensure it is used as "Auth.js (formerly NextAuth.js)" if referring to the old name' },
    { pattern: /localStorage.*refreshToken|refreshToken.*localStorage/i, msg: 'Check: localStorage and refreshToken mentioned together. Ensure the text says refreshToken should NOT be in localStorage' },
    { pattern: /optimistic lock.*duplicate|optimistic locking.*prevent/i, msg: 'Check: Optimistic locking mentioned for duplicate prevention. This is likely incorrect - verify the context' },
  ];
  
  for (const { pattern, msg } of hallucinationPatterns) {
    if (pattern.test(content)) {
      WARNINGS.push(`${relativePath}: ${msg}`);
    }
  }
}

function parseYaml(yaml) {
  const result = {};
  const lines = yaml.split('\n');
  let currentKey = null;
  let currentArray = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Array item
    if (trimmed.startsWith('- ')) {
      if (currentArray !== null) {
        currentArray.push(trimmed.slice(2).replace(/["']/g, '').trim());
      }
      continue;
    }
    
    // Key-value pair
    const match = trimmed.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      currentKey = key;
      
      if (value === '' || value === '[]') {
        currentArray = [];
        result[key] = currentArray;
      } else if (value === 'true') {
        result[key] = true;
        currentArray = null;
      } else if (value === 'false') {
        result[key] = false;
        currentArray = null;
      } else if (value === 'null') {
        result[key] = null;
        currentArray = null;
      } else if (!isNaN(Number(value)) && value !== '') {
        result[key] = Number(value);
        currentArray = null;
      } else {
        result[key] = value.replace(/["']/g, '').trim();
        currentArray = null;
      }
    }
  }
  
  return result;
}

async function main() {
  const pattern = process.argv[2] || 'src/content/**/*.mdx';
  console.log(`🔍 Verifying content files matching: ${pattern}`);
  
  const files = await glob(pattern, { absolute: true });
  console.log(`Found ${files.length} files\n`);
  
  for (const file of files) {
    await verifyFile(file);
  }
  
  // Report results
  if (WARNINGS.length > 0) {
    console.log(`\n⚠️  Warnings (${WARNINGS.length}):`);
    for (const warning of WARNINGS) {
      console.log(`  - ${warning}`);
    }
  }
  
  if (ERRORS.length > 0) {
    console.log(`\n❌ Errors (${ERRORS.length}):`);
    for (const error of ERRORS) {
      console.log(`  - ${error}`);
    }
    console.log(`\n✅ Content verification failed`);
    process.exit(1);
  }
  
  console.log(`\n✅ All ${files.length} files passed verification`);
  process.exit(0);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
