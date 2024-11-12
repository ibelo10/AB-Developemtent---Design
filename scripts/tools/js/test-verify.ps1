# test-verify.ps1

# Required files and directories
$requiredFiles = @(
    "src/scripts/tests/setup.js",
    "src/scripts/tests/test.config.js",
    "babel.config.js"
)

$requiredDirs = @(
    "src/scripts/tests/components"
)

# Check directories
Write-Host "`nChecking required directories..."
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "✅ Found directory: $dir"
    } else {
        Write-Host "❌ Missing directory: $dir"
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-Host "  └── Created directory: $dir"
    }
}

# Check files
Write-Host "`nChecking required files..."
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ Found file: $file"
    } else {
        Write-Host "❌ Missing file: $file"
        
        # Create missing files
        switch ($file) {
            "src/scripts/tests/setup.js" {
                $content = @'
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe(element) {
        this.callback([{ isIntersecting: true, target: element }]);
    }
    unobserve() {}
    disconnect() {}
};

// Mock window.matchMedia
window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn()
}));
'@
            }
            "babel.config.js" {
                $content = @'
module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 'current',
            },
        }],
    ],
    env: {
        test: {
            plugins: [
                '@babel/plugin-transform-modules-commonjs'
            ]
        }
    }
};
'@
            }
        }

        if ($content) {
            New-Item -ItemType File -Force -Path $file | Out-Null
            Set-Content -Path $file -Value $content
            Write-Host "  └── Created file: $file"
        }
    }
}

Write-Host "`nVerification complete!`n"