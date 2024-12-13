
# Function to ensure directory exists
function New-Directory {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Log "✓ Created directory: $Path"
    } else {
        Write-Log "⚠ Directory already exists: $Path"
    }
}

# Function to create a file if it doesn't exist
function New-FileIfNotExists {
    param (
        [string]$Path,
        [string]$Content,
        [string]$Description
    )

    try {
        if (-not (Test-Path $Path)) {
            $Content | Out-File -FilePath $Path -Encoding UTF8
            Write-Log "✓ Created $Description"
        } else {
            Write-Log "⚠ $Description already exists, skipping..."
        }
    } catch {
        Write-Log "❌ Error creating ${Description}: $_"
    }
}