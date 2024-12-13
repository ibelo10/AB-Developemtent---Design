# Logging.ps1
# Add timestamp to log file name
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "setup_log_$timestamp.txt"

# Function to write to console and log file
function Write-Log {
    param($Message)
    Write-Host $Message
    Add-Content -Path $logFile -Value $Message
}
