#!/bin/bash

echo "🔍 CHECKING TYPESCRIPT COMPILATION"
echo "=================================="

# Check TypeScript compilation
echo "Running TypeScript check..."
npx tsc --noEmit --skipLibCheck

echo ""
echo "🎯 Check complete!"
