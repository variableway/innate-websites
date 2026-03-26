#!/bin/bash

PROJECT_NAME=$1
COMMAND=${2:-dev}

if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: ./run.sh <project-name> [command]"
  echo ""
  echo "Examples:"
  echo "  ./run.sh pytopia-website-clone dev"
  echo "  ./run.sh cms-website-clone build"
  echo "  ./run.sh onur-dev"
  echo ""
  echo "Available projects in apps/:"
  ls -d apps/*/ 2>/dev/null | sed 's/apps\///g' | sed 's/\///g'
  exit 1
fi

PROJECT_PATH="apps/$PROJECT_NAME"

if [ ! -d "$PROJECT_PATH" ]; then
  echo "Error: Project '$PROJECT_NAME' not found in apps/"
  echo "Available projects:"
  ls -d apps/*/ 2>/dev/null | sed 's/apps\///g' | sed 's/\///g'
  exit 1
fi

echo "Running '$COMMAND' for project: $PROJECT_NAME"
cd "$PROJECT_PATH" && pnpm $COMMAND
