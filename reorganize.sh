#!/bin/bash

# Text styling
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting safe project reorganization...${NC}"

# Create backup
echo -e "${YELLOW}Creating backup of current project...${NC}"
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir="../project_backup_${timestamp}"
cp -r . "$backup_dir"
echo -e "${GREEN}Backup created at: $backup_dir${NC}"

# Function to update file paths in a file
update_imports() {
    local file=$1
    echo "Updating imports in $file..."
    
    # Update CSS imports
    sed -i 's|href="assets/css/|href="/src/assets/css/|g' "$file"
    sed -i 's|href="css/|href="/src/assets/css/|g' "$file"
    
    # Update JS imports
    sed -i 's|src="assets/js/|src="/src/assets/js/|g' "$file"
    sed -i 's|src="js/|src="/src/assets/js/|g' "$file"
    
    # Update image paths
    sed -i 's|src="assets/images/|src="/src/assets/images/|g' "$file"
    sed -i 's|src="images/|src="/src/assets/images/|g' "$file"
    
    # Update API endpoints for RN project
    sed -i 's|/.netlify/functions/fetch-sales|/RN/.netlify/functions/rn-fetch-sales|g' "$file"
}

# Function to safely move files
safe_move() {
    local source=$1
    local dest=$2
    if [ -f "$source" ]; then
        mkdir -p "$(dirname "$dest")"
        cp "$source" "$dest"
        echo "Moved: $source → $dest"
    fi
}

echo -e "${BLUE}Starting file reorganization...${NC}"

# Create new structure (without deleting old files)
mkdir -p {src/{components,pages,assets/{images,css,js},utils},public,docs,config}
mkdir -p netlify/functions

# Move and update Netlify configuration
echo -e "${YELLOW}Setting up Netlify configuration...${NC}"
cat > netlify.toml << EOL
[build]
  publish = "."
  functions = "netlify/functions"

[[redirects]]
  from = "/RN/*"
  to = "/projects/RN/:splat"
  status = 200

[[redirects]]
  from = "/projects/*"
  to = "/projects/:splat"
  status = 200

[[redirects]]
  from = "/src/*"
  to = "/src/:splat"
  status = 200
EOL

# Move files to new structure
echo -e "${YELLOW}Moving files to new structure...${NC}"
# Assets
cp -r assets/css/* src/assets/css/main/ 2>/dev/null
cp -r assets/js/* src/assets/js/main/ 2>/dev/null
cp -r assets/images/* src/assets/images/ 2>/dev/null

# Project files
mkdir -p projects/{RN,RNL,Ariels,KNK}
cp -r RN projects/
cp -r RNL projects/
cp -r Ariels projects/
cp -r KNK projects/

# Netlify functions
cp projects/RN/netlify/functions/fetch-sales.js netlify/functions/rn-fetch-sales.js 2>/dev/null

# Update imports in all HTML and JS files
echo -e "${YELLOW}Updating imports in files...${NC}"
find . -type f \( -name "*.html" -o -name "*.js" \) -not -path "*/node_modules/*" -not -path "*/.git/*" -exec bash -c 'update_imports "$0"' {} \;

echo -e "${GREEN}✅ Initial reorganization complete!${NC}"
echo -e "${YELLOW}Please review the changes in the new structure before removing old files.${NC}"
echo -e "${YELLOW}Your original files are backed up at: $backup_dir${NC}"

echo -e "${BLUE}To complete the reorganization:${NC}"
echo "1. Review the new structure in 'src' and 'projects' directories"
echo "2. Test all links and functionality"
echo "3. Run the following command to remove old files (ONLY after verifying everything works):"
echo -e "${RED}cleanup_command.sh${NC}"

# Create cleanup script
cat > cleanup_command.sh << 'EOL'
#!/bin/bash
echo "⚠️  This will remove old files. Make sure you have tested the new structure."
read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    rm -rf assets
    rm -rf RN
    rm -rf RNL
    rm -rf Ariels
    rm -rf KNK
    echo "🧹 Cleanup complete!"
fi
EOL
chmod +x cleanup_command.sh

# Print new structure
echo -e "${GREEN}New structure preview:${NC}"
tree -L 3 -I 'node_modules|.git|.env|backup*'