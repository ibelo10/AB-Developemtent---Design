# PowerShell script to check and fix HTML routes
Write-Host "Starting route check and fix script..." -ForegroundColor Green

try {
    # Find all HTML files recursively
    $htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

    foreach ($file in $htmlFiles) {
        Write-Host "Checking file: $($file.FullName)"
        
        # Read file content
        $content = Get-Content -Path $file.FullName -Raw

        # Create backup
        Copy-Item -Path $file.FullName -Destination "$($file.FullName).backup" -Force
        
        # Fix common path issues
        $content = $content -replace 'href="\./', 'href="/'
        $content = $content -replace 'src="\./', 'src="/'
        $content = $content -replace '\\', '/'
        $content = $content -replace 'href="//', 'href="/'
        $content = $content -replace 'src="//', 'src="/'
        
        # Fix navigation paths
        $content = $content -replace 'href="portfolio/index.html"', 'href="/portfolio/"'
        $content = $content -replace 'href="services/index.html"', 'href="/services/"'
        $content = $content -replace 'href="blog/index.html"', 'href="/blog/"'
        $content = $content -replace 'href="contact/index.html"', 'href="/contact/"'
        $content = $content -replace 'href="careers/index.html"', 'href="/careers/"'
        
        # Save changes
        $content | Set-Content -Path $file.FullName -Force
        
        Write-Host "Fixed routing in: $($file.Name)" -ForegroundColor Green
    }

    # Clean up backups
    Get-ChildItem -Path . -Filter "*.backup" -Recurse | Remove-Item

    Write-Host "`nRoute fixing completed successfully!" -ForegroundColor Green

} catch {
    Write-Host "An error occurred: $($_.Exception.Message)" -ForegroundColor Red
}