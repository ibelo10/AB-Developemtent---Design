# Create base project structure for GitHub Pages website

# Function to create directory if it doesn't exist
function New-DirectoryIfNotExists {
    param([string]$path)
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path
        Write-Host "Created directory: $path" -ForegroundColor Green
    }
}

# Base directory structure
$directories = @(
    "assets/css",
    "assets/js",
    "assets/images",
    "components",
    "scripts"
)

# Create directories
foreach ($dir in $directories) {
    New-DirectoryIfNotExists $dir
}

# Create base HTML file
$htmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AB Development & Design</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="assets/css/components.css">
</head>
<body>
    <div id="app"></div>
    <script src="assets/js/main.js" type="module"></script>
</body>
</html>
"@

# Create CSS files
$stylesCSS = @"
/* Base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Raleway', sans-serif;
    min-height: 100vh;
}
"@

$componentsCSS = @"
/* Component styles */
.full-mountain-image {
    width: 100%;
    height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
"@

# Create main JavaScript file
$mainJS = @"
// Main JavaScript file
import { initializeRipples } from './components/ripple.js';
import { initializeAnimations } from './components/animations.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeRipples();
    initializeAnimations();
});
"@

# Create component files
$rippleJS = @"
// Ripple effect component
export function initializeRipples() {
    // Ripple implementation will go here
}
"@

$animationsJS = @"
// Animations component
export function initializeAnimations() {
    // Animation implementation will go here
}
"@

# Write files
$files = @{
    "index.html" = $htmlContent
    "assets/css/styles.css" = $stylesCSS
    "assets/css/components.css" = $componentsCSS
    "assets/js/main.js" = $mainJS
    "assets/js/components/ripple.js" = $rippleJS
    "assets/js/components/animations.js" = $animationsJS
}

foreach ($file in $files.GetEnumerator()) {
    $filePath = $file.Key
    $content = $file.Value
    
    # Create parent directory if it doesn't exist
    $parentDir = Split-Path $filePath -Parent
    if ($parentDir -and -not (Test-Path $parentDir)) {
        New-Item -ItemType Directory -Path $parentDir -Force
    }
    
    # Create file
    Set-Content -Path $filePath -Value $content
    Write-Host "Created file: $filePath" -ForegroundColor Green
}

# Create GitHub-specific files
$gitignore = @"
# Dependencies
node_modules/

# Build output
dist/

# Environment files
.env
.env.local

# Editor directories
.vscode/
.idea/

# System files
.DS_Store
Thumbs.db
"@

Set-Content -Path ".gitignore" -Value $gitignore
Write-Host "Created .gitignore file" -ForegroundColor Green

# Create README
$readme = @"
# AB Development & Design

A modern, responsive landing page for AB Development & Design.

## Project Structure

- \`assets/\`: Contains CSS, JavaScript, and image files
- \`components/\`: Reusable component files
- \`scripts/\`: Utility scripts

## Setup

1. Clone this repository
2. Open index.html in your browser
3. For development, use a local server
"@

Set-Content -Path "README.md" -Value $readme
Write-Host "Created README.md file" -ForegroundColor Green

Write-Host "`nProject structure created successfully!" -ForegroundColor Cyan
Write-Host "You can now start developing your website." -ForegroundColor Cyan