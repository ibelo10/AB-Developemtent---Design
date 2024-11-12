// Updated CSS Conflict Checker (check-conflicts.js)
const fs = require("fs");
const path = require("path");

class CSSConflictChecker {
  constructor() {
    this.selectors = new Map();
    this.conflicts = [];
    this.rootDir = path.join(__dirname, "../../../src/styles");
    this.reportDir = path.join(__dirname, "../reports/css-audit");
  }

  async analyzeCSSFiles() {
    // Ensure report directory exists
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }

    const categories = {
      base: "/base",
      layouts: "/layouts",
      components: "/components",
      pages: "/pages",
      utils: "/utils",
    };

    const report = {
      totalFiles: 0,
      conflicts: [],
      specificityIssues: [],
      summary: {},
      categories: {},
    };

    // Analyze each category
    for (const [category, dir] of Object.entries(categories)) {
      const categoryPath = path.join(this.rootDir, dir);
      if (fs.existsSync(categoryPath)) {
        const files = await this.getCSSFiles(categoryPath);
        report.categories[category] = {
          fileCount: files.length,
          files: files.map((f) => path.relative(this.rootDir, f)),
        };
        report.totalFiles += files.length;

        for (const file of files) {
          const content = await fs.promises.readFile(file, "utf8");
          this.analyzeContent(content, file, report);
        }
      }
    }

    // Generate summary
    report.summary = {
      totalSelectors: this.selectors.size,
      totalConflicts: report.conflicts.length,
      totalSpecificityIssues: report.specificityIssues.length,
      categoriesAnalyzed: Object.keys(report.categories).length,
    };

    return report;
  }

  async getCSSFiles(directory) {
    const files = [];
    if (!fs.existsSync(directory)) return files;

    const entries = await fs.promises.readdir(directory, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await this.getCSSFiles(fullPath)));
      } else if (entry.isFile() && entry.name.endsWith(".css")) {
        files.push(fullPath);
      }
    }

    return files;
  }

  analyzeContent(content, filename, report) {
    // Remove comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, "");

    // Basic selector extraction
    const selectorRegex = /([^{}\n]+){[^{}]*}/g;
    let match;

    while ((match = selectorRegex.exec(content)) !== null) {
      const selector = match[1].trim();
      const specificity = this.calculateSpecificity(selector);
      const relativePath = path.relative(this.rootDir, filename);

      // Check for existing selectors
      if (this.selectors.has(selector)) {
        report.conflicts.push({
          selector,
          files: [
            relativePath,
            path.relative(this.rootDir, this.selectors.get(selector).file),
          ],
          specificity: specificity,
        });
      }

      // Store selector info
      this.selectors.set(selector, {
        file: filename,
        specificity: specificity,
      });

      // Check for specificity issues
      if (specificity > 100) {
        report.specificityIssues.push({
          selector,
          file: relativePath,
          specificity: specificity,
        });
      }
    }
  }

  calculateSpecificity(selector) {
    let score = 0;
    if (selector.includes("#")) score += 100;
    if (selector.includes(".")) score += 10;
    if (selector.includes(":")) score += 10;
    return score;
  }

  async generateReport(report) {
    const reportContent = `
CSS Conflict Analysis Report
Generated: ${new Date().toISOString()}

Summary:
- Total Files Analyzed: ${report.totalFiles}
- Total Selectors: ${report.summary.totalSelectors}
- Total Conflicts: ${report.summary.totalConflicts}
- Total Specificity Issues: ${report.summary.totalSpecificityIssues}

Files Analyzed by Category:
${Object.entries(report.categories)
  .map(
    ([category, data]) => `
${category.toUpperCase()}:
${data.files.map((file) => `  - ${file}`).join("\n")}`
  )
  .join("\n")}

Selector Conflicts:
${report.conflicts
  .map(
    (conflict) => `
- Selector: ${conflict.selector}
  Files: 
    - ${conflict.files[0]}
    - ${conflict.files[1]}
  Specificity: ${conflict.specificity}
`
  )
  .join("\n")}

High Specificity Issues:
${report.specificityIssues
  .map(
    (issue) => `
- Selector: ${issue.selector}
  File: ${issue.file}
  Specificity Score: ${issue.specificity}
`
  )
  .join("\n")}`;

    await fs.promises.writeFile(
      path.join(this.reportDir, "conflict-report.txt"),
      reportContent
    );
    return reportContent;
  }
}

// Run the analysis
async function runCSSAudit() {
  try {
    const checker = new CSSConflictChecker();
    const report = await checker.analyzeCSSFiles();
    await checker.generateReport(report);
    console.log(
      "CSS audit completed. Check scripts/tools/reports/css-audit/conflict-report.txt for results."
    );
  } catch (error) {
    console.error("Error running CSS audit:", error);
  }
}

runCSSAudit();
