# PowerShell script for setting up Chef 24/7 Kitchen Drip Website structure
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "setup_log_$timestamp.txt"

# Function to write to console and log file
function Write-Log {
    param($Message)
    Write-Host $Message
    Add-Content -Path $logFile -Value $Message
}

# Create directories
$directories = @(
    "assets",
    "assets/css",
    "assets/js",
    "assets/images",
    "assets/fonts"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Log "Created directory: $dir"
    }
}

# Create files with placeholder content
$files = @{
    "index.html" = "<!-- Chef 24/7 Kitchen Drip Website -->"
    "assets/css/chef24-main.css" = "/* Main CSS styles */"
    "assets/css/chef24-modal.css" = "/* Modal CSS styles */"
    "assets/css/chef24-animations.css" = "/* Animation CSS styles */"
    "assets/js/chef24-form.js" = "// Form handling code"
    "assets/js/chef24-animations.js" = "// Animation code"
    "assets/js/chef24-utils.js" = "// Utility functions"
    ".gitignore" = "node_modules/`n.DS_Store`nThumbs.db"
    "README.md" = "# Chef 24/7 Kitchen Drip Website`n`nPlaceholder README content"
}

foreach ($file in $files.Keys) {
    if (-not (Test-Path $file)) {
        $files[$file] | Out-File -FilePath $file -Encoding UTF8
        Write-Log "Created file: $file"
    }
}

Write-Log "`nProject setup complete! Directory structure:"
Get-ChildItem -Recurse | Where-Object { !$_.PSIsContainer } | Select-Object FullName

Write-Log "`nSetup completed successfully! Check the log file for details: $logFile"