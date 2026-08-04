# Portfolio Website with Draggable Social Media Popups

A modern, responsive portfolio website featuring draggable popup windows for social media platforms.

## Features

- **Modern Design**: Clean, gradient-based design with glassmorphism effects
- **Social Media Buttons**: Clickable buttons with icons for various social platforms
- **Draggable Popups**: Popup windows that can be moved around the screen
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects and smooth transitions throughout

## How to Use

1. **Open the website**: Simply open `index.html` in your web browser
2. **Click social media buttons**: Each button opens a draggable popup window
3. **Drag popups**: Click and drag the header of any popup to move it around
4. **Close popups**: Click the × button in the top-right corner of any popup

## Customization

### Personal Information
Edit the following in `index.html`:
- Your name (line 12)
- Your title/role (line 13)
- About me section (lines 25-27)
- Skills section (lines 32-45)

### Social Media Links
Update the social media URLs in `script.js` (lines 3-25):
```javascript
const socialPlatforms = {
    linkedin: {
        name: 'LinkedIn',
        description: 'Connect with me on LinkedIn to see my professional experience and network.',
        url: 'https://linkedin.com/in/YOUR_PROFILE', // Update this
        icon: 'fab fa-linkedin'
    },
    // ... update other platforms
};
```

### Styling
- Colors: Edit the CSS variables in `styles.css`
- Layout: Modify the grid and flexbox properties
- Animations: Adjust timing and effects in the CSS

### Adding More Social Platforms
1. Add a new button in `index.html`:
```html
<button class="social-btn" data-platform="yourplatform">
    <i class="fab fa-your-icon"></i>
    <span>Your Platform</span>
</button>
```

2. Add platform data in `script.js`:
```javascript
yourplatform: {
    name: 'Your Platform',
    description: 'Description of your platform.',
    url: 'https://yourplatform.com/yourprofile',
    icon: 'fab fa-your-icon'
}
```

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript for popup functionality
└── README.md           # This file
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technologies Used

- HTML5
- CSS3 (with modern features like backdrop-filter)
- Vanilla JavaScript (ES6+)
- Font Awesome icons

## Tips

- Test the website on different screen sizes
- Update the social media URLs before deploying
- Consider adding your own photos and projects
- You can add more sections like "Projects" or "Contact"
- The popups are positioned randomly when opened, but you can modify this behavior

## Deployment

To deploy this website:
1. Upload all files to your web hosting service
2. Update the social media URLs with your actual profiles
3. Customize the content to match your personal brand

Enjoy your new portfolio website! 🚀 