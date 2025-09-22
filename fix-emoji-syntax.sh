#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Fixing All Emoji Syntax Errors...${NC}"

# Function to fix emoji syntax in a file
fix_emoji_syntax() {
    local file=$1
    echo -e "${YELLOW}Fixing emoji syntax in: $file${NC}"

    # Create backup
    cp "$file" "$file.backup"

    # Fix unquoted emojis in return statements
    sed -i '' 's/return ⭐;/return '\''⭐'\'';/g' "$file"
    sed -i '' 's/return 🎯;/return '\''🎯'\'';/g' "$file"
    sed -i '' 's/return 🎬;/return '\''🎬'\'';/g' "$file"
    sed -i '' 's/return ☀️;/return '\''☀️'\'';/g' "$file"
    sed -i '' 's/return 🌙;/return '\''🌙'\'';/g' "$file"
    sed -i '' 's/return ✨;/return '\''✨'\'';/g' "$file"
    sed -i '' 's/return 🔥;/return '\''🔥'\'';/g' "$file"

    # Fix unquoted emojis in JSX expressions
    sed -i '' 's/{isDark ? ⭐ : ⭐}/{isDark ? '\''🌙'\'' : '\''☀️'\''}/g' "$file"
    sed -i '' 's/{⭐}/{'\''⭐'\''}/g' "$file"
    sed -i '' 's/{🎯}/{'\''🎯'\''}/g' "$file"
    sed -i '' 's/{🎬}/{'\''🎬'\''}/g' "$file"
    sed -i '' 's/{☀️}/{'\''☀️'\''}/g' "$file"
    sed -i '' 's/{🌙}/{'\''🌙'\''}/g' "$file"

    # Fix unquoted emojis in case statements
    sed -i '' "s/case 'cafe': return ⭐;/case 'cafe': return '⭐';/g" "$file"
    sed -i '' "s/case 'restaurant': return 🎬;/case 'restaurant': return '🎬';/g" "$file"
    sed -i '' "s/default: return ⭐;/default: return '⭐';/g" "$file"

    echo -e "${GREEN}✅ Fixed emoji syntax in: $file${NC}"
}

# Files that need emoji syntax fixes
files_to_fix=(
    "src/pages/Friends.tsx"
    "src/pages/BrandChallenges.tsx"
    "src/pages/Notifications.tsx"
    "src/pages/Rewards.tsx"
    "src/pages/Profile.tsx"
    "src/pages/Challenges.tsx"
)

# Process each file
for file in "${files_to_fix[@]}"; do
    if [ -f "$file" ]; then
        # Check if file contains unquoted emojis
        if grep -q "return [⭐🎯🎬☀️🌙✨🔥];" "$file" || grep -q "{[⭐🎯🎬☀️🌙✨🔥]}" "$file"; then
            fix_emoji_syntax "$file"
        else
            echo -e "${GREEN}✅ $file - No emoji syntax issues found${NC}"
        fi
    else
        echo -e "${RED}❌ $file - File not found${NC}"
    fi
done

echo -e "\n${BLUE}🔍 Checking for remaining emoji syntax issues...${NC}"

# Check for any remaining unquoted emojis
remaining_issues=$(grep -r "return [⭐🎯🎬☀️🌙✨🔥];\|{[⭐🎯🎬☀️🌙✨🔥]}" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || true)

if [ -n "$remaining_issues" ]; then
    echo -e "${YELLOW}⚠️  Found remaining emoji syntax issues:${NC}"
    echo "$remaining_issues"
else
    echo -e "${GREEN}✅ No remaining emoji syntax issues found!${NC}"
fi

echo -e "\n${BLUE}🎉 Emoji syntax fix process complete!${NC}"
echo -e "${YELLOW}Note: Backup files (.backup) have been created for all modified files${NC}"
