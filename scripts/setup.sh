#!/bin/bash

echo "🧹 Cleaning project..."
rm -f pnpm-lock.yaml
rm -rf node_modules

echo "📦 Installing dependencies..."
pnpm install

echo "🐕 Setting up Husky..."
npm run prepare

echo "🔧 Setting up git hooks..."
# Tạo pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh

# Run type checking
echo "🔍 Running type check..."
npm run type-check

# Run prettier formatting
echo "🔧 Running prettier..."
pnpm run format

# Run lint-staged for linting and formatting
echo "🔧 Running lint and format on staged files..."
npx lint-staged

# Run tests
echo "🧪 Running tests..."
npm run test:ci

echo "✅ Pre-commit checks passed!"
EOF

# Tạo commit-msg hook
cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh

# Validate commit message format
echo "📝 Validating commit message format..."
npx --no-install commitlint --edit "$1"

# Only show success message if commitlint passed
if [ $? -eq 0 ]; then
  echo "✅ Commit message format is valid!"
else
  echo "❌ Commit message format is invalid!"
  exit 1
fi
EOF

# Cấp quyền thực thi
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

echo "✅ Setup completed successfully!"
echo "🔄 You can now run: git commit -m\"feat: test commit\""
