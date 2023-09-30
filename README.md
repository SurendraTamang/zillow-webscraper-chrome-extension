
# Zillow Web Scraper Chrome Extension

This Chrome extension allows users to scrape property listings from Zillow and export the data as a CSV file.
I used the [Adrian's gist](https://gist.github.com/adrianhorning08/6305b872e172c4cc74edcac57370c1f5) to create the crawler.
Click and download

## Installation

1. **Clone the Repository**: Clone or download this repository to your local machine.

2. **Open Chrome Extensions**: Navigate to `chrome://extensions/` in your Chrome browser.

3. **Enable Developer Mode**: Toggle the "Developer mode" switch in the top right corner.

4. **Load the Extension**: Click on "Load unpacked" and select the directory containing the extension files.

5. **Launch the Extension**: Navigate to Zillow, click on the extension icon, and then click the "Start Scraping" button in the popup to begin the scraping process.

## Features

- **Automatic Scrolling**: The extension will automatically scroll through the Zillow listings page to load more properties.
  
- **Data Extraction**: Extracts property details such as address, price, number of beds and baths, square footage, and more.
  
- **CSV Export**: Once the scraping is complete, the data will be exported as a CSV file for easy analysis.

## Notes
  
- The scraper assumes certain elements and classes are present on the Zillow page. If Zillow changes their website structure, the scraper may break.

## Support

For any issues or enhancements, please open an issue or submit a pull request.
