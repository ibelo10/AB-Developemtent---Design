# Updated CSS Verification Script (verify-css.ps1)
$cssFiles = @(
    # Base Styles
    "src/styles/base/variables.css",
    "src/styles/base/reset.css",
    "src/styles/base/typography.css",

    # Layouts
    "src/styles/layouts/grid.css",
    "src/styles/layouts/header.css",
    "src/styles/layouts/footer.css",
    "src/styles/layouts/containers.css",

    # Components
    "src/styles/components/navbar.css",
    "src/styles/components/buttons.css",
    "src/styles/components/cards.css",
    "src/styles/components/background.css",
    "src/styles/components/device-preview.css",
    "src/styles/components/browser-chrome.css",
    "src/styles/components/portfolio-item.css",
    "src/styles/components/tech-tags.css",

    # Pages
    "src/styles/pages/home.css",
    "src/styles/pages/portfolio.css",
    "src/styles/pages/contact.css",
    "src/styles/pages/responsive.css",

    # Utils
    "src/styles/utils/animations.css",
    "src/styles/utils/responsive-portfolio.css"
)

# Create results directory if it doesn't exist
$resultsDir = "scripts/tools/reports/css-audit"
New-Item -ItemType Directory -Force -Path $resultsDir

# Initialize verification results
$verificationResults = @{
    missing = @()
    empty = @()
    existing = @()
}

# Verify each file
foreach ($file in $cssFiles) {
    $fullPath = Join-Path $PSScriptRoot "../../../$file"
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath
        if ($null -eq $content -or $content.Length -eq 0) {
            $verificationResults.empty += $file
        } else {
            $verificationResults.existing += $file
        }
    } else {
        $verificationResults.missing += $file
    }
}

# Generate verification report
$report = @"
CSS Files Verification Report
Generated: $(Get-Date)

Total Files Checked: $($cssFiles.Length)
✅ Existing Files: $($verificationResults.existing.Length)
❌ Missing Files: $($verificationResults.missing.Length)
⚠️ Empty Files: $($verificationResults.empty.Length)

Missing Files:
$($verificationResults.missing | ForEach-Object { "- $_" } | Out-String)

Empty Files:
$($verificationResults.empty | ForEach-Object { "- $_" } | Out-String)

Existing Files:
$($verificationResults.existing | ForEach-Object { "- $_" } | Out-String)
"@

# Save report
$report | Out-File "$resultsDir/verification-report.txt"

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
                New-Item -ItemType Directory -Force -Path $directory
            }
            New-Item -ItemType File -Force -Path $fullPath
            Write-Host "Created: $file"
        }
    }
}