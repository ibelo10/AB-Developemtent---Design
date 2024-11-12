# JavaScript File Verification Script
$jsFiles = @(
    # Main
    "src/scripts/main.js",

    # Core
    "src/scripts/core/router.js",
    "src/scripts/core/state-manager.js",
    "src/scripts/core/event-bus.js",

    # Components
    "src/scripts/components/header.js",
    "src/scripts/components/background-effects.js",
    "src/scripts/components/device-preview.js",
    "src/scripts/components/contact-form.js",
    "src/scripts/components/scrolling-text.js",
    "src/scripts/components/messenger.js",

    # Portfolio Components
    "src/scripts/components/portfolio/Portfolio.js",
    "src/scripts/components/portfolio/PortfolioItem.js",
    "src/scripts/components/portfolio-grid.js",

    # Utils
    "src/scripts/utils/animations.js",
    "src/scripts/utils/viewport.js",
    "src/scripts/utils/lazy-loading.js",
    "src/scripts/utils/ripple.js",

    # Pages
    "src/scripts/pages/home.js",
    "src/scripts/pages/portfolio.js",
    "src/scripts/pages/contact.js",

    # Config
    "src/scripts/config/portfolio.config.js",
    "config/routes.js",
    "config/theme.js",
    "config/site-settings.js"
)

# Create results directory if it doesn't exist
$resultsDir = "scripts/tools/reports/js-audit"
New-Item -ItemType Directory -Force -Path $resultsDir | Out-Null

# Initialize verification results
$verificationResults = @{
    missing = @()
    empty = @()
    existing = @()
}

# Function to get relative path
function Get-RelativePath {
    param (
        [string]$Path
    )
    return $Path.Replace("$((Get-Location).Path)\", "")
}

# Verify each file
foreach ($file in $jsFiles) {
    $fullPath = Join-Path $PSScriptRoot "../../../$file"
    $relativePath = Get-RelativePath $fullPath
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath
        if ($null -eq $content -or $content.Length -eq 0) {
            $verificationResults.empty += $relativePath
        } else {
            $verificationResults.existing += $relativePath
        }
    } else {
        $verificationResults.missing += $relativePath
    }
}

# Generate verification report
$report = @"
JavaScript Files Verification Report
Generated: $(Get-Date)

Total Files Checked: $($jsFiles.Length)
✅ Existing Files: $($verificationResults.existing.Length)
❌ Missing Files: $($verificationResults.missing.Length)
⚠️ Empty Files: $($verificationResults.empty.Length)

Missing Files:
$($verificationResults.missing | ForEach-Object { "- $_" } | Out-String)

Empty Files:
$($verificationResults.empty | ForEach-Object { "- $_" } | Out-String)

Existing Files:
$($verificationResults.existing | ForEach-Object { "- $_" } | Out-String)

File Structure Overview:
----------------------
Main:
- src/scripts/main.js

Core:
- router.js
- state-manager.js
- event-bus.js

Components:
- Standard Components
  $($jsFiles | Where-Object { $_ -match "src/scripts/components/[^/]+\.js" } | ForEach-Object { "  - $_" } | Out-String)
- Portfolio Components
  $($jsFiles | Where-Object { $_ -match "src/scripts/components/portfolio/" } | ForEach-Object { "  - $_" } | Out-String)

Utils:
$($jsFiles | Where-Object { $_ -match "src/scripts/utils/" } | ForEach-Object { "- $_" } | Out-String)

Pages:
$($jsFiles | Where-Object { $_ -match "src/scripts/pages/" } | ForEach-Object { "- $_" } | Out-String)

Config:
$($jsFiles | Where-Object { $_ -match "config/" } | ForEach-Object { "- $_" } | Out-String)
"@

# Save report
$report | Out-File "$resultsDir/js-verification-report.txt"

# Output to console
Write-Host $report

# Offer to create missing files
if ($verificationResults.missing.Length -gt 0) {
    $createMissing = Read-Host "Would you like to create the missing files? (y/n)"
    if ($createMissing -eq 'y') {
        foreach ($file in $verificationResults.missing) {
            $fullPath = Join-Path $PSScriptRoot "../../../$file"
            $directory = Split-Path $fullPath
            if (-not (Test-Path $directory)) {
                New-Item -ItemType Directory -Force -Path $directory | Out-Null
            }
            New-Item -ItemType File -Force -Path $fullPath | Out-Null
            Write-Host "Created: $file"
        }
    }
}