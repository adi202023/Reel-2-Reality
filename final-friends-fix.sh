#!/bin/bash

echo "🔧 DEFINITIVE FRIENDS.TSX FIX"
echo "============================="

# Backup the original file
cp src/pages/Friends.tsx src/pages/Friends.tsx.backup

# Get the content after line 14 (after imports)
tail -n +15 src/pages/Friends.tsx > temp_friends_body.txt

# Create completely clean import section
cat > src/pages/Friends.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Users, 
  Play, 
  Star, 
  Film, 
  ArrowLeft, 
  Trophy,
  Zap,
  Camera,
  Video
} from 'lucide-react';
EOF

# Append the rest of the file
cat temp_friends_body.txt >> src/pages/Friends.tsx

# Clean up temp file
rm temp_friends_body.txt

echo "✅ Friends.tsx completely rewritten"

# Test compilation
echo "🔍 Testing TypeScript compilation..."
if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
    echo "✅ TypeScript compilation successful!"
    echo "🎉 ALL ERRORS FIXED!"
    echo ""
    echo "🚀 NEXT STEPS:"
    echo "1. Run: ./start-servers.sh"
    echo "2. Access: http://localhost:8081"
    echo "3. Business: http://localhost:8081/business-auth"
else
    echo "❌ Still has errors:"
    npx tsc --noEmit --skipLibCheck
fi
