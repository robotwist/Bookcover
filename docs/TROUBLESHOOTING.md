# CI/CD Troubleshooting Guide

This guide helps you diagnose and fix common CI/CD failures in the Bookcover project.

## Quick Start

1. **Check GitHub Actions Logs**
   - Go to your repository's Actions tab
   - Click on the failed workflow
   - Look for red ❌ indicators
   - Check the specific job that failed

2. **Common Failure Points**
   ```mermaid
   graph TD
       A[CI/CD Failure] --> B{Which Stage?}
       B -->|Test| C[Test Failures]
       B -->|Build| D[Build Failures]
       B -->|Release| E[Release Failures]
       
       C --> C1[Unit Tests]
       C --> C2[Component Tests]
       C --> C3[Integration Tests]
       
       D --> D1[Missing Files]
       D --> D2[Build Errors]
       D --> D3[Permission Issues]
       
       E --> E1[Artifact Issues]
       E --> E2[Release Creation]
       E --> E3[Tag Problems]
   ```

## Test Failures

### 1. Unit Test Failures
**Symptoms**:
- Individual test failures
- Assertion errors
- Timing issues

**Solutions**:
```bash
# Run specific test file
npm test src/services/__tests__/PatternDetectionService.test.js

# Run with verbose output
npm test -- --verbose

# Run with coverage
npm test -- --coverage
```

### 2. Component Test Failures
**Symptoms**:
- DOM manipulation errors
- Missing elements
- Style issues

**Solutions**:
```bash
# Debug DOM issues
npm test -- --testPathPattern=Feed.test.js --verbose

# Check component rendering
npm test -- --testPathPattern=Stories.test.js --verbose
```

### 3. Integration Test Failures
**Symptoms**:
- Component interaction issues
- Service integration problems
- State management errors

**Solutions**:
```bash
# Debug integration tests
npm test -- --testPathPattern=FacebookPage.test.js --verbose
```

## Build Failures

### 1. Missing Files
**Symptoms**:
- "File not found" errors
- Missing dependencies
- Incorrect paths

**Solutions**:
```yaml
# Add debug step to workflow
- name: Debug Files
  if: failure()
  run: |
    echo "Current directory: $(pwd)"
    echo "Directory contents:"
    ls -la
    echo "Node modules:"
    ls -la node_modules
```

### 2. Build Errors
**Symptoms**:
- Compilation errors
- Syntax errors
- Dependency issues

**Solutions**:
```bash
# Clean and rebuild
rm -rf node_modules
npm cache clean --force
npm install
npm run build
```

### 3. Permission Issues
**Symptoms**:
- "Permission denied" errors
- File access issues
- Token problems

**Solutions**:
```yaml
# Add permissions to workflow
permissions:
  contents: write
  packages: write
```

## Release Failures

### 1. Artifact Issues
**Symptoms**:
- Missing artifacts
- Upload failures
- Size limits

**Solutions**:
```yaml
# Add artifact verification
- name: Verify Artifacts
  if: failure()
  run: |
    echo "Artifact directory:"
    ls -la dist/
    echo "Artifact sizes:"
    du -sh dist/*
```

### 2. Release Creation
**Symptoms**:
- Release creation fails
- Tag issues
- Version conflicts

**Solutions**:
```yaml
# Add release debugging
- name: Debug Release
  if: failure()
  run: |
    echo "Git tags:"
    git tag -l
    echo "Current version:"
    node -e "console.log(require('./package.json').version)"
```

## Environment-Specific Issues

### 1. Node Version Issues
**Symptoms**:
- Version mismatch
- Incompatible features
- Package compatibility

**Solutions**:
```yaml
# Specify exact Node version
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    steps:
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
```

### 2. Cache Issues
**Symptoms**:
- Slow builds
- Inconsistent state
- Stale dependencies

**Solutions**:
```yaml
# Implement better caching
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

## Debugging Tools

### 1. Local Reproduction
```bash
# Clone and setup
git clone https://github.com/yourusername/Bookcover.git
cd Bookcover
npm install

# Run specific workflow steps
npm test
npm run build
```

### 2. GitHub Actions Debugging
```yaml
# Add debug steps
- name: Debug Information
  if: failure()
  run: |
    echo "Node version: $(node -v)"
    echo "NPM version: $(npm -v)"
    echo "Git version: $(git --version)"
    echo "Current directory: $(pwd)"
    echo "Directory contents:"
    ls -la
```

### 3. Logging
```yaml
# Add detailed logging
- name: Run with logging
  run: |
    npm test -- --verbose
    npm run build -- --debug
```

## Prevention Strategies

### 1. Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm run build"
    }
  }
}
```

### 2. Branch Protection
- Enable branch protection rules
- Require status checks to pass
- Require pull request reviews

### 3. Regular Maintenance
- Update dependencies regularly
- Clean up old artifacts
- Monitor GitHub Actions minutes

## Getting Help

1. **Check GitHub Issues**
   - Search for similar issues
   - Check closed issues for solutions
   - Create a new issue if needed

2. **Community Support**
   - Stack Overflow
   - GitHub Discussions
   - Developer Forums

3. **Documentation**
   - GitHub Actions docs
   - Jest documentation
   - Node.js documentation 