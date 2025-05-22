```markdown
# Offline Journal

Offline Journal is a simple web-based journaling application designed to help users focus by requiring them to disconnect from the internet to write journal entries. The app stores entries locally in the browser using `localStorage`.

## Features

- **Offline Mode**: The app only allows journaling when the user is offline.
- **Auto-Save**: Automatically saves journal entries while typing (when offline).
- **Entry Management**: Create, view, and edit journal entries.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.

## Project Structure

```
offline-journal/
├── .gitignore          # Specifies files to ignore in version control
├── .vercel/            # Vercel project configuration (ignored by Git)
│   ├── project.json
│   └── README.txt
├── image/              # Contains images used in the project
│   └── article.png
├── index.html          # Main HTML file
├── script.js           # JavaScript file for app logic
├── styles.css          # CSS file for styling
```

## How to Use

1. **Open the App**: Open `index.html` in your browser.
2. **Go Offline**: Disconnect from the internet to enable journaling.
3. **Create a New Entry**: Click the "New Entry" button to start writing.
4. **Save Entries**: Entries are saved automatically or by clicking the "Save Entry" button.
5. **View Entries**: Click on an entry in the sidebar to view or edit it.

## Development

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge).

### Running Locally

1. Clone the repository:
   ```bash
   git clone <[repository-url](https://github.com/Ultimate-Guru/Offline-Journal)>
   ```
2. Open the `index.html` file in your browser.

### Deployment

This project can be deployed using [Vercel](https://vercel.com/). The `.vercel` folder contains the necessary configuration.

## Technologies Used

- **HTML5**: Structure of the app.
- **CSS3**: Styling and responsive design.
- **JavaScript**: App logic and offline functionality.
- **localStorage**: Persistent storage for journal entries.

## Screenshots

![App Screenshot](image/article.png)

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- Font: [Poppins](https://fonts.google.com/specimen/Poppins)
- Icons: [Favicon](image/article.png)
```

Save this content as `README.md` in your project directory.
