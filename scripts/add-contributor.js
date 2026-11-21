#!/usr/bin/env node

/**
 * makitdev — Add / Update Contributor Script
 *
 * Usage:
 *   node scripts/add-contributor.js <github-username> [options]
 *
 * Options:
 *   --name "Full Name"
 *   --role "Role (e.g. Core Contributor, Developer, Maintainer)"
 *   --contribution "Description of contribution"
 *   --category "Maintainers | Contributors | Community"
 *   --avatar "Custom avatar URL"
 *
 * Example:
 *   node scripts/add-contributor.js octocat --role "Core Contributor" --contribution "Developer tools and documentation."
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const args = process.argv.slice(2);

if (!args.length || args[0].startsWith('-')) {
  console.log('Usage: node scripts/add-contributor.js <github-username> [options]');
  console.log('Options:');
  console.log('  --name "Full Name"');
  console.log('  --role "Role"');
  console.log('  --contribution "Description of contribution"');
  console.log('  --category "Maintainers | Contributors"');
  console.log('  --avatar "https://..."');
  process.exit(1);
}

const username = args[0];

if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(username)) {
  console.error(`Error: "${username}" is not a valid GitHub username.`);
  process.exit(1);
}

function parseOption(flag, defaultValue = '') {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return defaultValue;
}

const customName = parseOption('--name');
const customRole = parseOption('--role', 'Contributor');
const customContribution = parseOption('--contribution', 'Open-source contributions and software improvements.');
const customCategory = parseOption('--category', 'Contributors');
const customAvatar = parseOption('--avatar');

function fetchGitHubUser(user) {
  return new Promise((resolve) => {
    const url = `https://api.github.com/users/${encodeURIComponent(user)}`;
    const req = https.get(
      url,
      { headers: { 'User-Agent': 'makitdev-site-cli' } },
      (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (data && data.login) {
              resolve(data);
              return;
            }
          } catch (e) {}
          resolve(null);
        });
      }
    );
    req.on('error', () => { resolve(null); });
    req.setTimeout(5000, () => {
      req.abort();
      resolve(null);
    });
  });
}

/**
 * Read the contributor roster out of assets/data/contributors.js.
 *
 * The file is `window.MDK_CONTRIBUTORS = [ ... ];` — one JSON array literal.
 * A non-greedy regex is NOT safe here: any string value containing the
 * sequence `];` (e.g. a contribution like "Refactored parse() [x.js]; tests.")
 * would truncate the match and JSON.parse would throw, which used to silently
 * reset the roster to [] and then overwrite the file with just the new entry.
 *
 * So we anchor on the first `[` after the assignment and the LAST `]` in the
 * file, and treat any failure as fatal: we never write over data we could not
 * read.
 */
function readContributors(file) {
  if (!fs.existsSync(file)) {
    return [];
  }
  return extractArray(fs.readFileSync(file, 'utf8'), file);
}

/** Pull the JSON array literal out of a `window.MDK_CONTRIBUTORS = [ ... ];` file. */
function extractArray(source, label) {
  const assign = source.indexOf('window.MDK_CONTRIBUTORS');
  const start = assign === -1 ? -1 : source.indexOf('[', assign);
  const end = source.lastIndexOf(']');

  if (start === -1 || end === -1 || end < start) {
    fail(`Could not find the MDK_CONTRIBUTORS array literal in ${label}. Refusing to overwrite it.`);
  }

  let parsed;
  try {
    parsed = JSON.parse(source.slice(start, end + 1));
  } catch (e) {
    fail(`Could not parse the contributor array in ${label}: ${e.message}\nRefusing to overwrite it.`);
  }

  if (!Array.isArray(parsed)) {
    fail(`The MDK_CONTRIBUTORS value in ${label} is not an array. Refusing to overwrite it.`);
  }

  return parsed;
}

/** Print a fatal error and exit without touching any file. */
function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

async function main() {
  console.log(`Fetching details for GitHub user: @${username}...`);
  const gh = await fetchGitHubUser(username);

  const name = customName || (gh && gh.name) || username;
  const avatar = customAvatar || (gh && gh.avatar_url) || `https://github.com/${username}.png`;
  const github = (gh && gh.html_url) || `https://github.com/${username}`;

  const contributorObj = {
    name: name,
    username: username,
    role: customRole,
    contribution: customContribution,
    category: customCategory,
    github: github,
    avatar: avatar
  };

  const masterFile = path.resolve(__dirname, '..', 'assets', 'data', 'contributors.js');
  const contributors = readContributors(masterFile);

  const existingIdx = contributors.findIndex(
    (c) => c.username && c.username.toLowerCase() === username.toLowerCase()
  );

  if (existingIdx !== -1) {
    // Keep the username exactly as it was first recorded: GitHub usernames are
    // case-insensitive, but this value is used to build the profile URL and the
    // @handle shown on the page, so re-casing it would be a gratuitous change.
    const existing = contributors[existingIdx];
    contributors[existingIdx] = Object.assign({}, existing, contributorObj, {
      username: existing.username
    });
    console.log(`Updated existing contributor: @${existing.username}`);
  } else {
    contributors.push(contributorObj);
    console.log(`Added new contributor: ${name} (@${username})`);
  }

  const jsStr = `window.MDK_CONTRIBUTORS = ${JSON.stringify(contributors, null, 2)};\n`;

  const filesToSync = [
    { file: path.resolve(__dirname, '..', 'assets', 'data', 'contributors.js'), content: jsStr }
  ];

  // Round-trip the payload through the same extractor used above, so we can
  // never write out a file that this script would refuse to read back.
  const fromJs = extractArray(jsStr, 'the generated assets/data/contributors.js');
  if (!Array.isArray(fromJs) || fromJs.length === 0) {
    fail('Serialized contributor data did not round-trip cleanly. Nothing was written.');
  }

  for (const item of filesToSync) {
    const dir = path.dirname(item.file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(item.file, item.content, 'utf8');
  }

  console.log('Successfully updated contributor data:');
  console.log('  - assets/data/contributors.js');
}

main();
