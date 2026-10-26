#!/bin/bash
#stop if any command fails
set -e

echo "Checking Node.js and pnpm versions..."

# Check Node.js version
if command -v node &> /dev/null; then
    echo "Node.js version: $(node -v)"
else
    echo "Node.js is not installed. See https://nodejs.org/en/download/"
    exit 1
fi


# Check if pnpm is installed
if command -v pnpm >/dev/null; then
    echo "pnpm version: $(pnpm --version)"
else
    echo "pnpm is not installed. See https://pnpm.io/installation"
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && pnpm i
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && pnpm i
cd ..

echo "Dependencies installed successfully."

echo "Starting the application..."

echo "Starting the backend on http://localhost:4242"
(cd backend && pnpm start) &


echo "Starting the frontend on http://localhost:3000"
(cd frontend && pnpm run dev) &

echo "Application started successfully. Press Ctrl + C to stop."
trap 'kill 0' EXIT
wait