#!/bin/bash

# Create necessary directories
mkdir -p assets/{css,js,images}
mkdir -p {blog,services,portfolio,contact}

# Download and save external resources locally
# jQuery
curl -o assets/js/jquery.min.js https://code.jquery.com/jquery-3.6.0.min.js
# Ripples effect
curl -o assets/js/jquery.ripples.min.js https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js
# Font Awesome
curl -o assets/css/all.min.css https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css

# Create index files for routes
for dir in blog services portfolio contact; do
  echo '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/"></head></html>' > $dir/index.html
done

# Set proper permissions
chmod -R 755 assets
chmod +x setup.sh

echo "Setup complete! Please ensure you have:"
echo "1. Moved your ABLogo.png to assets/images/"
echo "2. Updated your CSS and JS files to use local paths"
echo "3. Deployed with 'netlify deploy --prod'"
