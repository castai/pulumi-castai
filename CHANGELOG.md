# Changelog

All notable changes to the CAST AI Pulumi Provider will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2023-04-09

### Added
- Documentation for publishing to Pulumi Registry
- GitHub Actions workflow for automated publishing
- Release checklist and publishing guide

### Changed
- Updated schema.json metadata for Pulumi Registry compatibility
- Modified pluginDownloadURL to use GitHub releases format

### Fixed
- Corrected TypeScript example scripts to focus on Pulumi operations

## [0.1.1] - 2023-04-01

### Added
- Support for CAST AI evictor and pod pinner in examples
- Improved error handling in provider

### Changed
- Updated dependencies to latest versions
- Enhanced TypeScript type definitions

### Fixed
- Fixed issue with node template constraints

## [0.1.0] - 2023-03-15

### Added
- Initial release of the CAST AI Pulumi Provider
- Support for connecting EKS, GKE, and AKS clusters to CAST AI
- Basic autoscaling configuration
- Examples for TypeScript, Python, and Go
