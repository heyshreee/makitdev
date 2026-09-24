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
  let contributors = [];

  if (fs.existsSync(masterFile)) {
    try {
      const match = fs.readFileSync(masterFile, 'utf8').match(/window\.MDK_CONTRIBUTORS\s*=\s*(\[[\s\S]*?\]);/);
      if (match) {
        contributors = JSON.parse(match[1]);
      }
    } catch (e) {
      contributors = [];
    }
  }

  if (!Array.isArray(contributors)) contributors = [];

  const existingIdx = contributors.findIndex(
    (c) => c.username && c.username.toLowerCase() === username.toLowerCase()
  );

  if (existingIdx !== -1) {
    contributors[existingIdx] = Object.assign({}, contributors[existingIdx], contributorObj);
    console.log(`Updated existing contributor: @${username}`);
  } else {
    contributors.push(contributorObj);
    console.log(`Added new contributor: ${name} (@${username})`);
  }

  const jsonStr = JSON.stringify(contributors, null, 2) + '\n';
  const jsStr = `window.MDK_CONTRIBUTORS = ${JSON.stringify(contributors, null, 2)};\n`;

  const filesToSync = [
    { file: path.resolve(__dirname, '..', 'assets', 'data', 'contributors.js'), content: jsStr },
    { file: path.resolve(__dirname, '..', 'makitdev-theme', 'assets', 'data', 'contributors.json'), content: jsonStr }
  ];

  for (const item of filesToSync) {
    const dir = path.dirname(item.file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(item.file, item.content, 'utf8');
  }

  console.log('Successfully synchronized all contributor data files:');
  console.log('  - assets/data/contributors.js');
  console.log('  - makitdev-theme/assets/data/contributors.json');
}

main();
