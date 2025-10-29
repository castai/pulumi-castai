#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read version from version.txt
const version = fs.readFileSync(path.join(__dirname, 'version.txt'), 'utf8').trim();
console.log(`Using version ${version} from version.txt`);

// Update package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const oldVersion = packageJson.version;
packageJson.version = version;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log(`Updated package.json version from ${oldVersion} to ${version}`);

// Also update SDK package.json if it exists
const sdkPackageJsonPath = path.join(__dirname, 'sdk', 'nodejs', 'package.json');
if (fs.existsSync(sdkPackageJsonPath)) {
  const sdkPackageJson = JSON.parse(fs.readFileSync(sdkPackageJsonPath, 'utf8'));
  const oldSdkVersion = sdkPackageJson.version;
  sdkPackageJson.version = version;
  
  fs.writeFileSync(sdkPackageJsonPath, JSON.stringify(sdkPackageJson, null, 2) + '\n');
  console.log(`Updated sdk/nodejs/package.json version from ${oldSdkVersion} to ${version}`);
} 