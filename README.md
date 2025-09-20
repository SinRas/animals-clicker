https://animals-clicker.com/

# 🐾 Animals Clicker

A React-based clicker game where users can click on animal icons and track their progress. The app stores click data in local storage and syncs with a server every 13 seconds.

## ✨ Features

- **Interactive Animal Icons**: Click on 6 different animal emojis (🐱🐶🐰🐦🐠🦋)
- **Local Storage**: All click data is automatically saved to browser's local storage
- **Auto Sync**: Automatically syncs with server every 13 seconds
- **Manual Sync**: Option to manually trigger sync
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient background with glassmorphism effects

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd animals-clicker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── AnimalIcon.js          # Individual animal clickable component
│   ├── AnimalIcon.css
│   ├── ClickCounter.js        # Displays total click count
│   ├── ClickCounter.css
│   ├── SyncStatus.js          # Shows sync status and controls
│   └── SyncStatus.css
├── hooks/
│   └── useLocalStorage.js     # Custom hook for localStorage
├── services/
│   └── syncService.js         # Server sync logic
├── App.js                     # Main application component
├── App.css                    # Main application styles
├── index.js                   # React entry point
└── index.css                  # Global styles
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory to configure the API endpoint:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

## 🔄 Next.js Backend Integration

The project is designed to be easily integrated with a Next.js backend. The sync service (`src/services/syncService.js`) contains commented code showing how to implement the actual API calls.

### Backend API Endpoint
When you add the Next.js backend, create an API endpoint at `/api/sync-clicks` that accepts:

```json
{
  "clicks": {
    "cat": 5,
    "dog": 3,
    "rabbit": 1
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "userId": "anonymous"
}
```

## 🎨 Customization

### Adding New Animals
Edit the `ANIMALS` array in `src/App.js`:

```javascript
const ANIMALS = [
  { id: 'cat', name: 'Cat', emoji: '🐱' },
  { id: 'dog', name: 'Dog', emoji: '🐶' },
  // Add your new animal here
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄' }
];
```

### Styling
- Global styles: `src/index.css`
- App layout: `src/App.css`
- Component styles: `src/components/*.css`

## 📱 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🛠️ Technologies Used

- **React 18** - Frontend framework
- **CSS3** - Styling with modern features (backdrop-filter, gradients)
- **Local Storage API** - Data persistence
- **Create React App** - Build tooling

## 📄 License

This project is licensed under the MIT License.
