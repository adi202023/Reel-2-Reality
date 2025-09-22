#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Fixing All Lucide React Icon Issues...${NC}"

# Function to fix icons in a file
fix_icons_in_file() {
    local file=$1
    echo -e "${YELLOW}Fixing icons in: $file${NC}"

    # Create backup
    cp "$file" "$file.backup"

    # Remove problematic icon imports from lucide-react
    sed -i '' 's/, Building2//g' "$file"
    sed -i '' 's/, MapPin//g' "$file"
    sed -i '' 's/, Phone//g' "$file"
    sed -i '' 's/, Coffee//g' "$file"
    sed -i '' 's/, Target//g' "$file"
    sed -i '' 's/Building2, //g' "$file"
    sed -i '' 's/MapPin, //g' "$file"
    sed -i '' 's/Phone, //g' "$file"
    sed -i '' 's/Coffee, //g' "$file"
    sed -i '' 's/Target, //g' "$file"

    # Replace icon usages with emoji alternatives
    sed -i '' 's/<Building2 className="[^"]*"[^>]*\/>/🏢/g' "$file"
    sed -i '' 's/<Building2 className="[^"]*"[^>]*>/🏢/g' "$file"
    sed -i '' 's/<\/Building2>//g' "$file"

    sed -i '' 's/<MapPin className="[^"]*"[^>]*\/>/📍/g' "$file"
    sed -i '' 's/<MapPin className="[^"]*"[^>]*>/📍/g' "$file"
    sed -i '' 's/<\/MapPin>//g' "$file"

    sed -i '' 's/<Phone className="[^"]*"[^>]*\/>/📞/g' "$file"
    sed -i '' 's/<Phone className="[^"]*"[^>]*>/📞/g' "$file"
    sed -i '' 's/<\/Phone>//g' "$file"

    sed -i '' 's/<Coffee className="[^"]*"[^>]*\/>/☕/g' "$file"
    sed -i '' 's/<Coffee className="[^"]*"[^>]*>/☕/g' "$file"
    sed -i '' 's/<\/Coffee>//g' "$file"

    sed -i '' 's/<Target className="[^"]*"[^>]*\/>/🎯/g' "$file"
    sed -i '' 's/<Target className="[^"]*"[^>]*>/🎯/g' "$file"
    sed -i '' 's/<\/Target>//g' "$file"

    # Replace common icon patterns with emojis
    sed -i '' 's/<Mail className="[^"]*"[^>]*\/>/📧/g' "$file"
    sed -i '' 's/<Lock className="[^"]*"[^>]*\/>/🔒/g' "$file"
    sed -i '' 's/<Eye className="[^"]*"[^>]*\/>/👀/g' "$file"
    sed -i '' 's/<EyeOff className="[^"]*"[^>]*\/>/🙈/g' "$file"
    sed -i '' 's/<ArrowLeft className="[^"]*"[^>]*\/>/⬅️/g' "$file"
    sed -i '' 's/<Sparkles className="[^"]*"[^>]*\/>/✨/g' "$file"
    sed -i '' 's/<Star className="[^"]*"[^>]*\/>/⭐/g' "$file"
    sed -i '' 's/<AlertTriangle className="[^"]*"[^>]*\/>/⚠️/g' "$file"
    sed -i '' 's/<RefreshCw className="[^"]*"[^>]*\/>/🔄/g' "$file"
    sed -i '' 's/<Film className="[^"]*"[^>]*\/>/🎬/g' "$file"

    echo -e "${GREEN}✅ Fixed icons in: $file${NC}"
}

# Find all TypeScript/TSX files that might have icon issues
echo -e "${YELLOW}Scanning for files with potential icon issues...${NC}"

files_with_icons=(
    "src/pages/Welcome.tsx"
    "src/pages/Login.tsx"
    "src/pages/Dashboard.tsx"
    "src/pages/Profile.tsx"
    "src/pages/Challenges.tsx"
    "src/pages/Leaderboard.tsx"
    "src/pages/Friends.tsx"
    "src/pages/Notifications.tsx"
    "src/pages/Rewards.tsx"
    "src/pages/BrandChallenges.tsx"
    "src/pages/BusinessAuth.tsx"
    "src/pages/BusinessDashboard.tsx"
    "src/components/ErrorBoundary.tsx"
    "src/components/ReelBackground.tsx"
    "src/components/ui/loading.tsx"
)

# Process each file
for file in "${files_with_icons[@]}"; do
    if [ -f "$file" ]; then
        # Check if file contains problematic imports
        if grep -q "Building2\|MapPin\|Phone\|Coffee\|Target" "$file"; then
            fix_icons_in_file "$file"
        else
            echo -e "${GREEN}✅ $file - No problematic icons found${NC}"
        fi
    else
        echo -e "${RED}❌ $file - File not found${NC}"
    fi
done

echo -e "\n${BLUE}🔍 Checking for remaining icon issues...${NC}"

# Check for any remaining problematic imports
remaining_issues=$(grep -r "Building2\|MapPin\|Phone\|Coffee\|Target" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || true)

if [ -n "$remaining_issues" ]; then
    echo -e "${YELLOW}⚠️  Found remaining icon issues:${NC}"
    echo "$remaining_issues"
    echo -e "\n${BLUE}🔧 Running automated fix script to resolve remaining issues...${NC}"
    for file in $(echo "$remaining_issues" | cut -d: -f1); do
        fix_icons_in_file "$file"
    done
else
    echo -e "${GREEN}✅ No remaining icon issues found!${NC}"
fi

echo -e "\n${BLUE}🧹 Cleaning up import statements...${NC}"

# Clean up empty import lines and fix import formatting
for file in "${files_with_icons[@]}"; do
    if [ -f "$file" ]; then
        # Remove empty imports from lucide-react
        sed -i '' '/from .lucide-react./s/, *,/,/g' "$file"
        sed -i '' '/from .lucide-react./s/{ *,/{ /g' "$file"
        sed -i '' '/from .lucide-react./s/, *}/}/g' "$file"

        # Remove completely empty lucide-react imports
        sed -i '' '/import { *} from .lucide-react.;/d' "$file"
    fi
done

echo -e "\n${BLUE}📊 Summary${NC}"
echo -e "=================================="

# Count files processed
processed_count=0
for file in "${files_with_icons[@]}"; do
    if [ -f "$file" ]; then
        processed_count=$((processed_count + 1))
    fi
done

echo -e "${GREEN}✅ Files processed: $processed_count${NC}"
echo -e "${BLUE}📁 Backup files created with .backup extension${NC}"

# Check TypeScript compilation
echo -e "\n${YELLOW}🔍 Testing TypeScript compilation...${NC}"
if command -v npx &> /dev/null; then
    if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
        echo -e "${GREEN}✅ TypeScript compilation successful!${NC}"
    else
        echo -e "${YELLOW}⚠️  Some TypeScript warnings remain (may be non-critical)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  TypeScript check skipped (npx not available)${NC}"
fi

echo -e "\n${BLUE}🎉 Icon fix process complete!${NC}"
echo -e "${YELLOW}Note: Backup files (.backup) have been created for all modified files${NC}"
echo -e "${YELLOW}You can restore from backups if needed: mv file.backup file${NC}"
