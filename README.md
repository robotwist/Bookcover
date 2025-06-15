# Bookcover - A Distraction-Free Facebook Experience

Bookcover is a browser extension that enhances your Facebook experience by removing distracting elements and helping you focus on what matters most.

## Features

- **Clean Feed**: Removes sponsored content and suggested posts
- **Smart Detection**: Automatically adapts to Facebook's UI changes
- **Customizable**: Configure which elements to hide or show
- **Lightweight**: Minimal performance impact
- **Privacy-Focused**: No data collection or tracking

## Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (coming soon)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/Bookcover.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `Bookcover` directory

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the extension:
   ```bash
   npm run build
   ```
3. For development with hot reloading:
   ```bash
   npm run dev
   ```

### Project Structure
```
Bookcover/
├── src/
│   ├── pages/          # Page-specific components
│   ├── services/       # Core services
│   ├── utils/          # Utility functions
│   └── manifest.json   # Extension manifest
├── tests/              # Test files
├── dist/              # Built extension
└── docs/              # Documentation
```

### Testing
Run the test suite:
```bash
npm test
```

For more details about our testing approach, see [TESTING.md](docs/TESTING.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Facebook for providing a platform that we can enhance
- The open-source community for inspiration and tools
- All contributors who help make Bookcover better

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/Bookcover](https://github.com/yourusername/Bookcover)
