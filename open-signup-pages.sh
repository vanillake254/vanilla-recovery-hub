#!/bin/bash

# Open all signup pages in browser
# This script opens the registration pages for all required services

echo "🚀 Opening signup pages in your browser..."
echo ""
echo "You'll need to sign up for:"
echo "  1. MongoDB Atlas (database)"
echo "  2. Flutterwave (payments)"
echo "  3. Resend (emails - optional)"
echo ""
echo "Opening pages in 3 seconds..."
sleep 3

# Open MongoDB Atlas signup
echo "📂 Opening MongoDB Atlas..."
xdg-open "https://www.mongodb.com/cloud/atlas/register" 2>/dev/null || \
  open "https://www.mongodb.com/cloud/atlas/register" 2>/dev/null || \
  echo "   → https://www.mongodb.com/cloud/atlas/register"

sleep 2

# Open Flutterwave signup
echo "💳 Opening Flutterwave..."
xdg-open "https://flutterwave.com/ke/signup" 2>/dev/null || \
  open "https://flutterwave.com/ke/signup" 2>/dev/null || \
  echo "   → https://flutterwave.com/ke/signup"

sleep 2

# Open Resend signup
echo "📧 Opening Resend (optional)..."
xdg-open "https://resend.com/signup" 2>/dev/null || \
  open "https://resend.com/signup" 2>/dev/null || \
  echo "   → https://resend.com/signup"

echo ""
echo "✅ All pages opened!"
echo ""
echo "📖 Follow the instructions in QUICK_SETUP.md"
echo "   or SETUP_GUIDE.md for detailed steps."
echo ""
