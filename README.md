# Bazooka Egypt Scraper

A web scraping project built with Playwright and Node.js that extracts menu data from the Bazooka Egypt website and exports it to JSON format.

## Features

* Extracts all menu categories.
* Extracts product names.
* Extracts product descriptions.
* Extracts product images.
* Handles single-price and multi-size products.
* Detects offer categories and discounted prices.
* Exports structured JSON data.
* Includes error handling for network and scraping failures.

## Technologies Used

* Node.js
* Playwright
* JavaScript (ES Modules)
* File System API

## Project Structure

```text
bazooka-egypt-scraper/
│
├── src/
│   └── scraper.mjs
│
├── output/
│   └── bazooka_menu.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Installation

Clone the repository:

```bash
git clone <(https://github.com/Mohamed-Ali-Auto-dev/bazooka-egypt-scraper)>
cd bazooka-egypt-scraper
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Usage

Run the scraper:

```bash
node src/scraper.mjs
```

The extracted data will be saved to:

```text
output/bazooka_menu.json
```

## Sample Output

```json
[
    {
        "category": "offers",
        "totalItems": 21,
        "items": [
            {
                "name": "بوكس المونديال1",
                "image": "https://bazookaegy.com/public/uploads/meals/s_1776593428202336.jpeg",
                "description": "10قطع فرايد تشكن+3عيش",
                "hasMultiplePrices": false,
                "price": "400.00 جنيه",
                "oldPrice": "800.00 جنيه",
                "prices": null
            },
            {
                "name": "تشيكن باربيكيو",
                "image": "https://bazookaegy.com/public/uploads/meals/s_1738168187193737.jpg",
                "description": "صدور الدجاج الكرسبي بصوص البربيكيو ، صوص الجبنه السايحه خس ، طماطم ، خيار مخلل ،حلقات بصل مقليه",
                "hasMultiplePrices": true,
                "price": null,
                "oldPrice": null,
                "prices": [
                    {
                        "kind": "single",
                        "kindPrice": "155.00 جنيه"
                    },
                    {
                        "kind": "double",
                        "kindPrice": "215.00 جنيه"
                    },
                    {
                        "kind": "triple",
                        "kindPrice": "240.00 جنيه"
                    }
                ]
            }
        ]
    }
]
```

## Learning Objectives

This project was created to practice:

* Browser automation using Playwright.
* DOM inspection and data extraction.
* Working with asynchronous JavaScript.
* JSON data processing.
* Error handling and file operations.

## Notes

* The scraper is designed specifically for the current structure of the Bazooka Egypt website.
* Changes to the website structure may require selector updates.
