# Coffee Menu App ☕

## Project Overview

Coffee Menu App is an interactive single-page web application that allows users to explore a curated menu of coffee drinks, leave reviews, and toggle between user and admin modes.

### Key Features

- 🌍 Comprehensive coffee menu display
- 🔍 Advanced search and filtering capabilities
- ⭐ Interactive review system
- 🌓 Dark/Light theme toggle
- 👨‍💼 Admin mode for menu management

## Technologies Used

- HTML5
- CSS3 (with CSS Variables for theming)
- Vanilla JavaScript
- JSON Server (for backend simulation)

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Modern web browser

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/I-GIKARU/coffee-menu-app
cd coffee-menu-app
```

### 2. Install JSON Server Globally

```bash
npm install -g json-server
```

### 3. Start JSON Server

```bash
json-server --watch db.json
```

### 4. Open the Application

Simply open the `index.html` file in your web browser.

## Application Features

### 1. Coffee Menu
- Browse a collection of coffee drinks
- View detailed information about each coffee
- See price, type, and description

### 2. Search & Filter
- Search coffees by name
- Filter coffees by type (Hot, Cold, Espresso)

### 3. Review System
- Add reviews for individual coffee drinks
- Rate drinks from 1-5 stars
- Write detailed comments

### 4. Theming
- Toggle between light and dark themes
- Smooth, eye-friendly color transitions

### 5. Admin Mode
- Switch between user and admin views
- Delete coffee items from the menu

## Event Listeners

The application implements multiple event listeners:
- Theme Toggle (click)
- Admin Mode Toggle (click)
- Search Input (input)
- Type Filter (change)
- Review Form Submission

## Array Methods Utilized

- `.filter()`: Search and filter coffees
- `.map()`: Render coffee cards
- `.forEach()`: Add event listeners

## Responsive Design

The application is designed to be responsive and work across various device sizes.

## Customization

### Modifying Coffee Data
Edit the `db.json` file to update coffee menu items, add new drinks, or modify existing entries.

### Theming
Customize theme colors by modifying CSS variables in the `:root` and `.dark-theme` selectors.

## Potential Future Enhancements
- User authentication
- More advanced admin features
- Integration with a backend database
- Internationalization

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

