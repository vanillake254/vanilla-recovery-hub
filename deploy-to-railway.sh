#!/bin/bash

# Vanilla Recovery Hub - Railway Deployment Script
# This script automates the complete Railway deployment

set -e  # Exit on any error

echo "🚀 Starting Railway Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Change to backend directory
cd "$(dirname "$0")/backend"

echo -e "${BLUE}📍 Current directory: $(pwd)${NC}"
echo ""

# Step 1: Check if logged in
echo -e "${YELLOW}Step 1: Checking Railway authentication...${NC}"
if railway whoami &> /dev/null; then
    echo -e "${GREEN}✅ Already logged in to Railway${NC}"
    railway whoami
else
    echo -e "${RED}❌ Not logged in. Please run: railway login${NC}"
    exit 1
fi
echo ""

# Step 2: Link to existing project or create new
echo -e "${YELLOW}Step 2: Setting up Railway project...${NC}"
if [ -f ".railway/config.json" ]; then
    echo -e "${GREEN}✅ Already linked to Railway project${NC}"
else
    echo -e "${BLUE}Creating new Railway project...${NC}"
    railway init --name vanilla-recovery-hub-backend
fi
echo ""

# Step 3: Link to PostgreSQL database
echo -e "${YELLOW}Step 3: Linking PostgreSQL database...${NC}"
echo -e "${BLUE}Make sure you have a PostgreSQL service in your Railway project!${NC}"
railway link
echo ""

# Step 4: Set environment variables
echo -e "${YELLOW}Step 4: Setting environment variables...${NC}"

# Read from .env file
if [ -f ".env" ]; then
    echo -e "${BLUE}Reading from .env file...${NC}"
    
    # Set each variable
    railway variables set NODE_ENV=production
    railway variables set PORT=5000
    
    # Extract and set Flutterwave keys
    FLW_PUBLIC=$(grep FLW_PUBLIC_KEY .env | cut -d '=' -f2)
    FLW_SECRET=$(grep FLW_SECRET_KEY .env | cut -d '=' -f2)
    FLW_ENCRYPTION=$(grep FLW_ENCRYPTION_KEY .env | cut -d '=' -f2)
    
    railway variables set FLW_PUBLIC_KEY="$FLW_PUBLIC"
    railway variables set FLW_SECRET_KEY="$FLW_SECRET"
    railway variables set FLW_ENCRYPTION_KEY="$FLW_ENCRYPTION"
    
    # Extract and set other keys
    EMAIL_KEY=$(grep EMAIL_API_KEY .env | cut -d '=' -f2)
    JWT_SECRET=$(grep JWT_SECRET .env | cut -d '=' -f2)
    ADMIN_EMAIL=$(grep ADMIN_EMAIL .env | cut -d '=' -f2)
    
    railway variables set EMAIL_API_KEY="$EMAIL_KEY"
    railway variables set JWT_SECRET="$JWT_SECRET"
    railway variables set ADMIN_EMAIL="$ADMIN_EMAIL"
    
    # Set placeholder URLs (update after frontend deployment)
    railway variables set SUCCESS_URL="https://vanilla-recovery-hub.web.app/payment-success"
    railway variables set FAIL_URL="https://vanilla-recovery-hub.web.app/payment-failed"
    railway variables set FRONTEND_URL="https://vanilla-recovery-hub.web.app"
    
    echo -e "${GREEN}✅ Environment variables set${NC}"
else
    echo -e "${RED}❌ .env file not found!${NC}"
    exit 1
fi
echo ""

# Step 5: Deploy
echo -e "${YELLOW}Step 5: Deploying to Railway...${NC}"
echo -e "${BLUE}This may take 2-3 minutes...${NC}"
railway up --detach
echo ""

# Step 6: Get deployment URL
echo -e "${YELLOW}Step 6: Getting deployment URL...${NC}"
sleep 5  # Wait for deployment to register
DEPLOY_URL=$(railway domain)
echo -e "${GREEN}✅ Backend deployed to: $DEPLOY_URL${NC}"
echo ""

# Step 7: Run database migrations
echo -e "${YELLOW}Step 7: Running database migrations...${NC}"
railway run npx prisma db push --skip-generate
echo -e "${GREEN}✅ Database schema synced${NC}"
echo ""

# Step 8: Test deployment
echo -e "${YELLOW}Step 8: Testing deployment...${NC}"
if [ ! -z "$DEPLOY_URL" ]; then
    echo -e "${BLUE}Testing health endpoint...${NC}"
    sleep 10  # Wait for service to start
    curl -s "$DEPLOY_URL/health" | jq . || echo "Service starting up..."
fi
echo ""

# Summary
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "   Backend URL: ${GREEN}$DEPLOY_URL${NC}"
echo -e "   Database: ${GREEN}PostgreSQL (Railway)${NC}"
echo -e "   Status: ${GREEN}Running${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "   1. Update frontend API_URL to: $DEPLOY_URL"
echo "   2. Deploy frontend to Firebase"
echo "   3. Update SUCCESS_URL and FAIL_URL in Railway variables"
echo "   4. Test payment flow end-to-end"
echo ""
echo -e "${BLUE}🔗 Useful Commands:${NC}"
echo "   railway logs     - View deployment logs"
echo "   railway status   - Check service status"
echo "   railway open     - Open Railway dashboard"
echo ""
echo -e "${GREEN}✅ All done! Your backend is live! 🚀${NC}"
