# scripts/tools/js/generate-reports.ps1

# Configuration
$config = @{
    ReportDir = "scripts/tools/reports/js-audit"
    TestResults = "test-results"
    Coverage = "coverage"
    Archive = "archive"
    MaxArchives = 5
}

# Create directory structure
function Create-ReportDirectories {
    $dirs = @(
        $config.ReportDir,
        "$($config.ReportDir)/$($config.TestResults)",
        "$($config.ReportDir)/$($config.Coverage)",
        "$($config.ReportDir)/$($config.Archive)"
    )

    foreach ($dir in $dirs) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "Created directory: $dir"
        }
    }
}

# Archive old reports
function Archive-OldReports {
    $timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
    $archiveDir = "$($config.ReportDir)/$($config.Archive)/$timestamp"
    
    # Create archive directory
    New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null

    # Move existing reports to archive
    $dirsToArchive = @($config.TestResults, $config.Coverage)
    foreach ($dir in $dirsToArchive) {
        $sourcePath = "$($config.ReportDir)/$dir"
        if (Test-Path $sourcePath) {
            Copy-Item -Path "$sourcePath/*" -Destination "$archiveDir/$dir" -Recurse -Force
        }
    }

    # Clean old archives
    $archives = Get-ChildItem "$($config.ReportDir)/$($config.Archive)" | Sort-Object CreationTime -Descending
    if ($archives.Count -gt $config.MaxArchives) {
        $archives | Select-Object -Skip $config.MaxArchives | Remove-Item -Recurse -Force
    }
}

# Generate HTML index
function Generate-ReportIndex {
    $indexPath = "$($config.ReportDir)/index.html"
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    $html = @"
<!DOCTYPE html>
<html>
<head>
    <title>Test Reports - AB Development & Design</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header { 
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
        }
        .report-section { 
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        .report-link { 
            display: block; 
            padding: 12px 15px;
            margin: 8px 0;
            background: #fff;
            text-decoration: none;
            color: #333;
            border-radius: 4px;
            border: 1px solid #ddd;
            transition: all 0.3s ease;
        }
        .report-link:hover { 
            background: #f0f0f0;
            transform: translateY(-2px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .timestamp { 
            color: #666; 
            font-size: 0.9em;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>JavaScript Test Reports</h1>
            <p class="timestamp">Generated: $timestamp</p>
        </div>

        <div class="report-section">
            <h2>Latest Reports</h2>
            <a href="test-results/test-report.html" class="report-link">Test Results Report</a>
            <a href="coverage/lcov-report/index.html" class="report-link">Coverage Report</a>
            <a href="test-results/junit.xml" class="report-link">JUnit Report</a>
        </div>

        <div class="report-section">
            <h2>Archives</h2>
            $(
                Get-ChildItem "$($config.ReportDir)/$($config.Archive)" |
                Sort-Object CreationTime -Descending |
                ForEach-Object {
                    $archiveDate = $_.Name
                    "<div class='archive-entry'>
                        <h3>$archiveDate</h3>
                        <a href='archive/$archiveDate/test-results/test-report.html' class='report-link'>Test Results</a>
                        <a href='archive/$archiveDate/coverage/lcov-report/index.html' class='report-link'>Coverage Report</a>
                    </div>"
                }
            )
        </div>
    </div>
</body>
</html>
"@

    $html | Out-File -FilePath $indexPath -Encoding UTF8
    Write-Host "Generated report index at: $indexPath"
}

# Main execution
try {
    Write-Host "Starting report generation..."
    
    # Create directories
    Create-ReportDirectories
    
    # Archive existing reports
    Archive-OldReports
    
    # Run tests with coverage
    npm run test:coverage
    
    # Generate index
    Generate-ReportIndex
    
    # Open report in default browser
    Start-Process "$($config.ReportDir)/index.html"
    
    Write-Host "`nReport generation completed successfully!"
} catch {
    Write-Host "Error generating reports: $_" -ForegroundColor Red
}