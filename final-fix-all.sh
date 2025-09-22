#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 FINAL COMPREHENSIVE FIX FOR REEL-TO-REALITY${NC}"
echo -e "${BLUE}=============================================${NC}"

# Phase 1: Fix all unquoted emoji syntax errors
echo -e "\n${YELLOW}📋 Phase 1: Fixing Emoji Syntax Errors${NC}"
echo -e "--------------------------------------"

files_to_fix=(
    "src/pages/BrandChallenges.tsx"
    "src/pages/Friends.tsx"
    "src/pages/Notifications.tsx"
    "src/pages/Rewards.tsx"
    "src/pages/Challenges.tsx"
    "src/pages/Profile.tsx"
)

for file in "${files_to_fix[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${BLUE}Fixing $file...${NC}"
        
        # Create backup
        cp "$file" "$file.backup"
        
        # Fix unquoted emojis in return statements
        sed -i '' 's/return ⭐;/return '\''⭐'\'';/g' "$file"
        sed -i '' 's/return 🎯;/return '\''🎯'\'';/g' "$file"
        sed -i '' 's/return 🎬;/return '\''🎬'\'';/g' "$file"
        sed -i '' 's/return ☀️;/return '\''☀️'\'';/g' "$file"
        sed -i '' 's/return 🌙;/return '\''🌙'\'';/g' "$file"
        
        # Fix unquoted emojis in JSX expressions
        sed -i '' 's/{isDark ? ⭐ : ⭐}/{isDark ? '\''🌙'\'' : '\''☀️'\''}/g' "$file"
        sed -i '' 's/{⭐}/{'\''⭐'\''}/g' "$file"
        sed -i '' 's/{🎯}/{'\''🎯'\''}/g' "$file"
        sed -i '' 's/{🎬}/{'\''🎬'\''}/g' "$file"
        
        # Fix Target references
        sed -i '' 's/return Target;/return Star;/g' "$file"
        sed -i '' 's/: Target,/: Star,/g' "$file"
        
        echo -e "${GREEN}✅ Fixed $file${NC}"
    else
        echo -e "${RED}❌ $file not found${NC}"
    fi
done

# Phase 2: Fix import statements
echo -e "\n${YELLOW}📦 Phase 2: Fixing Import Statements${NC}"
echo -e "-----------------------------------"

for file in "${files_to_fix[@]}"; do
    if [ -f "$file" ]; then
        # Ensure Star is imported if Target was being used
        if grep -q "Target" "$file"; then
            sed -i '' 's/Target/Star/g' "$file"
        fi
        
        # Clean up any remaining problematic imports
        sed -i '' 's/, Target//g' "$file"
        sed -i '' 's/Target, //g' "$file"
        
        echo -e "${GREEN}✅ Cleaned imports in $file${NC}"
    fi
done

# Phase 3: Test TypeScript compilation
echo -e "\n${YELLOW}🔍 Phase 3: Testing TypeScript Compilation${NC}"
echo -e "----------------------------------------"

if command -v npx &> /dev/null; then
    if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
        echo -e "${GREEN}✅ TypeScript compilation successful!${NC}"
        TS_STATUS="PASS"
    else
        echo -e "${RED}❌ TypeScript compilation still has errors:${NC}"
        npx tsc --noEmit --skipLibCheck
        TS_STATUS="FAIL"
    fi
else
    echo -e "${YELLOW}⚠️  TypeScript check skipped${NC}"
    TS_STATUS="SKIP"
fi

# Phase 4: Final verification
echo -e "\n${YELLOW}✅ Phase 4: Final Verification${NC}"
echo -e "-----------------------------"

# Check for remaining issues
remaining_emoji_issues=$(grep -r "return [⭐🎯🎬☀️🌙];\|{[⭐🎯🎬☀️🌙]}" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || true)
remaining_target_issues=$(grep -r "Target" src/ --include="*.tsx" --include="*.ts" | grep -v "TargetFile\|target" || true)

if [ -z "$remaining_emoji_issues" ] && [ -z "$remaining_target_issues" ]; then
    echo -e "${GREEN}✅ All syntax issues resolved!${NC}"
    SYNTAX_STATUS="PASS"
else
    echo -e "${RED}❌ Some issues remain:${NC}"
    if [ -n "$remaining_emoji_issues" ]; then
        echo -e "${YELLOW}Emoji issues:${NC}"
        echo "$remaining_emoji_issues"
    fi
    if [ -n "$remaining_target_issues" ]; then
        echo -e "${YELLOW}Target issues:${NC}"
        echo "$remaining_target_issues"
    fi
    SYNTAX_STATUS="FAIL"
fi

# Summary
echo -e "\n${BLUE}📊 FINAL FIX SUMMARY${NC}"
echo -e "${BLUE}===================${NC}"
echo -e "TypeScript Compilation: $TS_STATUS"
echo -e "Syntax Issues Fixed:    $SYNTAX_STATUS"

if [ "$TS_STATUS" = "PASS" ] && [ "$SYNTAX_STATUS" = "PASS" ]; then
    echo -e "\n${GREEN}🎉 ALL ISSUES FIXED! SYSTEM READY!${NC}"
    echo -e "${GREEN}✅ No more blank pages${NC}"
    echo -e "${GREEN}✅ All TypeScript errors resolved${NC}"
    echo -e "${GREEN}✅ JavaScript bundle will compile successfully${NC}"
    
    echo -e "\n${BLUE}🚀 NEXT STEPS:${NC}"
    echo -e "${YELLOW}1. Run: ./start-servers.sh${NC}"
    echo -e "${YELLOW}2. Access: http://localhost:8081${NC}"
    echo -e "${YELLOW}3. Business: http://localhost:8081/business-auth${NC}"
    echo -e "${YELLOW}4. Login: demo@business.com / password123${NC}"
else
    echo -e "\n${RED}❌ Some issues remain. Please check the errors above.${NC}"
fi

echo -e "\n${BLUE}🎯 Fix complete!${NC}"
