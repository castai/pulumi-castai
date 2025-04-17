# Contributing to Pulumi CAST AI Provider

Thank you for your interest in contributing to the Pulumi CAST AI Provider! We welcome and appreciate all kinds of contributions.

## Code of Conduct

Please make sure to read and observe our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. Fork this repository
2. Clone the forked repository
3. Install dependencies and build the provider as described in the [README.md](README.md)

## Pull Requests

1. Update the README.md with details of changes to the interface if applicable.
2. Update examples if necessary.
3. Update the documentation if applicable.
4. Follow the coding style of the project.
5. The PR should work for all supported languages (TypeScript, Python, Go, and C#).

## Coding Guidelines

- Follow Go best practices for the provider code
- Use consistent naming in all SDK languages
- Document all public APIs
- Write unit tests for all new functionality

## Development Workflow

The development workflow typically follows these steps:

1. Build the provider binary
   ```bash
   make provider
   ```

2. Generate the SDKs
   ```bash
   make build_sdks
   ```

3. Install the provider locally
   ```bash
   make install_provider
   ```

4. Test your changes with example code in the examples directory

## Releasing

Releases are handled by the maintainers of the repository.
