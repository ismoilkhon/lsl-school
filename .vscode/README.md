# VS Code Configuration

This directory contains VS Code workspace settings to optimize the development experience for this Next.js + Tailwind CSS project.

## Files

- `settings.json` - Workspace settings that:
  - Disables CSS validation to prevent false positives with Tailwind directives
  - Configures Tailwind CSS IntelliSense
  - Enables quick suggestions for CSS strings
  - References custom CSS data for Tailwind directives

- `css_custom_data.json` - Custom CSS data that defines Tailwind CSS directives for the language server

## Extensions Recommended

- Tailwind CSS IntelliSense
- PostCSS Language Support
- CSS IntelliSense

## Troubleshooting

If you still see CSS linter warnings about unknown at-rules:

1. Make sure you have the Tailwind CSS IntelliSense extension installed
2. Restart VS Code
3. Check that the workspace settings are being applied (should see "Workspace" in the settings UI)

The warnings are harmless and don't affect functionality - they're just the CSS linter not recognizing Tailwind's custom directives.
