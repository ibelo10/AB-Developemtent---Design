#!/bin/bash

# Create main directories if they don't exist
mkdir -p {blog,services,portfolio,store,legal,careers,projects,assets/{css,js,images}}

# Move main pages to root
echo "Moving main pages..."
mv -f blog.html blog/index.html 2>/dev/null
mv -f services.html services/index.html 2>/dev/null
mv -f portfolio.html portfolio/index.html 2>/dev/null
mv -f contact.html contact/index.html 2>/dev/null
mv -f store.html store/index.html 2>/dev/null

# Move legal documents
echo "Moving legal documents..."
mkdir -p legal
mv -f privacy-policy.html terms.html NDA.html legal/ 2>/dev/null

# Move career related files
echo "Moving career related files..."
mv -f Careers/* careers/ 2>/dev/null
mv -f CareersExample.html careers/ 2>/dev/null

# Move all CSS files to assets/css
echo "Moving CSS files..."
mv -f *.css assets/css/ 2>/dev/null
mv -f src/assets/css/* assets/css/ 2>/dev/null 

# Move all JS files to assets/js
echo "Moving JavaScript files..."
mv -f *.js assets/js/ 2>/dev/null
mv -f src/assets/js/* assets/js/ 2>/dev/null

# Move all images to assets/images
echo "Moving images..."
mv -f src/assets/images/* assets/images/ 2>/dev/null

# Create projects directory structure
echo "Organizing project files..."
mv -f ArielsPralines.html projects/ariels/ 2>/dev/null
mv -f ZKPsAB.html projects/zkp/ 2>/dev/null

# Clean up empty directories
echo "Cleaning up..."
find . -type d -empty -delete

# Create a backup of the original structure
echo "Creating backup..."
tar -czf site_backup_$(date +%Y%m%d).tar.gz *

echo "Reorganization complete! New structure:"
tree -I 'node_modules|.env|.git|.netlify|.vs' -a --dirsfirst

# Print completion message
echo "
Site structure has been reorganized. New structure:
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── blog/
├── careers/
├── contact/
├── legal/
├── portfolio/
├── projects/
├── services/
└── store/
"