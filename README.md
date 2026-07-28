# 🛒 Fly Bazaar — E-Commerce Website

<p align="center">

A modern, fully responsive, multi-category e-commerce website built from scratch using HTML5, CSS3, and vanilla JavaScript. It features a large product catalog, live search, shopping cart, wishlist, product detail pages, and production-ready SEO, performance, and accessibility optimizations.

</p>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-Yes-success?style=flat-square)
![Netlify](https://img.shields.io/badge/Hosted%20on-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)

## 📑 Table of Contents

- 🔗 [Links](#-links)
- 📸 [Showcase & Interface Preview](#-showcase--interface-preview)
- ✨ [Features](#-features)
- 🛠️ [Tech Stack](#️-tech-stack)
- 📁 [Project Structure](#-project-structure)
- 🚀 [Installation](#-installation)
- 🌐 [Browser Support](#-browser-support)
- 🚀 [Future Improvements](#-future-improvements)
- 👨‍💻 [Author](#-author)
- 📄 [License](#-license)

## 🔗 Links

- **🌐 Live Demo:** [Fly Bazaar](https://fly-bazaar-ahmadraza.netlify.app/)
- **👨‍💻 Portfolio:** [Portfolio](https://portfolio-ahmad-raza-khan.netlify.app/)
- **📂 GitHub Repository:** [Fly Bazaar Repository](https://github.com/ahmad-raza-khan9121/fly-bazaar)

## 📸 Showcase & Interface Preview

<p align="center">
  <i>Explore the user interface, dynamic components, and layout architecture of <b>Fly-Bazaar</b>.</i>
</p>

---

### 🏠 01. Homepage & Hero Interface

> _Features the main landing section, live search bar, promotional hero banners, and core navigation structure._

<div align="center">
  <img src="assets/project/fly-bazaar-home-page.jpg" alt="Fly Bazaar Home Page" width="100%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"/>
</div>

<br>

### 📂 02. Product Categories Grid

> _Displays intuitive category filtering, product listings, and dynamic grid layouts across 40+ departments._

<div align="center">
  <img src="assets/project/fly-bazaar-categories.jpg" alt="Fly Bazaar Categories" width="100%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"/>
</div>

<br>

### ℹ️ 03. About Us & Brand Story

> _Presents brand information, platform values, vision, and responsive team showcase modules._

<div align="center">
  <img src="assets/project/fly-bazaar-about.jpg" alt="Fly Bazaar About Page" width="100%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"/>
</div>

<br>

### 🦶 04. Footer & Navigation Links

> _Houses quick links, customer support details, newsletter subscription, and social media integration._

<div align="center">
  <img src="assets/project/fly-bazaar-footer-section.jpg" alt="Fly Bazaar Footer" width="100%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"/>
</div>

---

## ✨ Features

- 390+ products across multiple categories
- Cart and wishlist with persistent state using `localStorage`
- Live product search with instant results and deep-linking to matching items
- Product detail view with quantity selector before add-to-cart
- Demo login/register modal
- Fully responsive layout for mobile, tablet, and desktop
- SEO optimized with meta tags, Open Graph tags, JSON-LD, `sitemap.xml`, and `robots.txt`
- PWA support via `manifest.json`
- Performance optimized with lazy-loaded and compressed images
- Accessibility-friendly with skip-to-content, keyboard navigation, ARIA labels, and visible focus states
- Custom 404 page
- Clean, modular file structure
- Semantic HTML5 structure
- Mobile-first responsive design
- Clean and organized project architecture
- Cross-browser compatibility
- Optimized asset organization, performance and accessibility

## 🛠️ Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/LocalStorage-4285F4?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/>
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white"/>
</p>

## 📁 Project Structure

```bash
fly-bazaar/
├── .vscode/
├── assets/ # Main directory for all media assets and static files
│ │
│ ├── favicon/ # Multi-resolution favicons for browser tabs & devices
│ │ ├── apple-touch-icon.png
│ │ ├── favicon-16x16.png
│ │ ├── favicon-32x32.png
│ │ ├── favicon-512.png
│ │ └── favicon.ico
│ │
│ ├── images/ # Product assets organized by category
│ │ ├── beauty-imgs/ # Cosmetics, skincare & beauty product media
│ │ ├── deals/ # Promotional banners, discount tags, and special deal images
│ │ ├── education/ # Images related to books, stationery, and learning materials
│ │ ├── electronics & cals/ # Electronics items, gadgets, and appliances images
│ │ ├── foods & drinks/ # Packaged food, grocery items, and beverage images
│ │ ├── furniture/ # Home and office furniture product images
│ │ ├── home/ # Products images For Homepage
│ │ ├── kids-imgs/ # Children's clothing, toys, and baby care product images
│ │ ├── men-imgs/ # Men's fashion, footwear, and apparel images
│ │ ├── sports/ # Sports equipment, fitness gear, and athletic wear images
│ │ ├── trends/ # Trending items, seasonal collections, and featured products
│ │ └── women-imgs/ # Women's fashion, clothing, and accessory images
│ │
│ ├── project/ # Portfolio screenshots & project preview assets
│ │ ├── fly-bazaar-about.jpg
│ │ ├── fly-bazaar-categories.jpg
│ │ ├── fly-bazaar-footer-section.jpg
│ │ └── fly-bazaar-home-page.jpg
│ │
│ ├── favicon.svg
│ ├── fly-bazaar-logo.png # Official brand logo of Fly-Bazaar
│ └── profile.jpg # Developer/Author profile picture
│
├── css/ # Cascading Style Sheets (Stylesheet files) for layout & UI
│ ├── about.css
│ ├── cart.css
│ ├── contact.css
│ ├── page-styles.css
│ ├── responsive.css
│ └── style.css
│
├── js/ # JavaScript logic, data handling & dynamic behavior files
│ ├── cart.js
│ ├── main.js
│ └── products-data.js
│
├── pages/ # Dynamic HTML templates & category sub-pages
│ ├── beauty/ # Beauty category pages & templates
│ │ └── beauty.html
│ ├── education/ # Education category pages & templates
│ │ └── education.html
│ ├── electronics/ # Electronics category pages & templates
│ │ └── electronics.html
│ ├── foods/ # Food & beverages category pages
│ │ └── foods.html
│ ├── furniture/ # Furniture category pages & templates
│ │ └── furniture.html
│ ├── kids/ # Kids products category pages
│ │ └── kids.html
│ ├── men/ # Men's fashion category pages
│ │ └── men.html
│ ├── sports/ # Sports category pages & templates
│ │ └── sports.html
│ ├── trends/ # Trending products category pages
│ │ └── trends.html
│ └── women/ # Women's fashion category pages
│ └── women.html
│
├── .gitignore
├── 404.html
├── about.html
├── cart.html
├── contact.html
├── CONTRIBUTING.md
├── deals.html
├── index.html
├── LICENSE
├── manifest.json
├── README.md
├── robots.txt
├── SECURITY.md
├── sitemap.xml
└── wishlist.html
```

---

## 🚀 Installation

Follow these steps to run the project locally.

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ahmad-raza-khan9121/fly-bazaar.git
```

### 2. Open the project folder

```bash
cd fly-bazaar
```

### 3. Launch the project

Open the **index.html** file in your preferred web browser.

No additional dependencies or installation are required.

---

## 🌐 Browser Support

Fly Bazaar has been tested and works smoothly on all modern web browsers.

| Browser         | Supported |
| --------------- | --------- |
| Google Chrome   | ✅        |
| Microsoft Edge  | ✅        |
| Mozilla Firefox | ✅        |
| Safari          | ✅        |
| Opera           | ✅        |

---

## 📌 Future Improvements

The following enhancements are planned for future versions of the project.

- User Authentication (Login & Signup)
- Payment Gateway Integration
- Product Reviews & Ratings
- Order Tracking
- Admin Dashboard
- Backend & Database Integration
- Dark Mode
- Product Filters & Sorting
- Personalized Recommendations
- Progressive Web App (PWA)

---

## 👨‍💻 Author

**Ahmad Raza Khan**

Frontend Web Developer

📍 Parbhani, Maharashtra, India

📧 Email: ahmadraza.khan9121@gmail.com

🌐 **Portfolio:** [portfolio-ahmad-raza-khan.netlify.app](https://portfolio-ahmad-raza-khan.netlify.app)

💻 **GitHub:** [ahmad-raza-khan9121](https://github.com/ahmad-raza-khan9121)

---

## 📄 License

This project is intended for portfolio and educational purposes.

© Ahmad Raza Khan. All rights reserved.

The source code, design, images, and project assets may not be copied, modified, redistributed, reused, commercially exploited, or re-uploaded without prior written permission from the author.

Please refer to the LICENSE file for complete licensing information.

---

⭐ If you like this project, consider giving it a star on GitHub.

---
