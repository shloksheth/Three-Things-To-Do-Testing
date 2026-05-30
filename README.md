# Three Things to Do

A smooth, visually beautiful, aesthetically calming task management and calendar app. Built with React, Vite, Tailwind CSS 4, and Framer Motion.

## 🚀 Deployment as a Website

The app is optimized for hosting on **GitHub Pages** or **Vercel**.

### GitHub Pages (Recommended)
This project is already configured for GitHub Pages via the `base: '/three-things-to-do/'` setting in `vite.config.js`.

1. **Push to GitHub**: Push your code to a repository named `three-things-to-do`.
2. **Build and Deploy**:
   ```bash
   npm run build
   ```
   Deploy the contents of the `dist/` folder to the `gh-pages` branch. You can use the `gh-pages` npm package to automate this:
   ```bash
   npm install --save-dev gh-pages
   # Add "deploy": "gh-pages -d dist" to package.json scripts
   npm run deploy
   ```

### Vercel
1. Connect your GitHub repository to Vercel.
2. Ensure the **Framework Preset** is set to **Vite**.
3. Set the **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. *Note*: If you deploy to the root of a domain on Vercel, change `base: '/three-things-to-do/'` to `base: '/'` in `vite.config.js`.

---

## 📱 Using it as a Mobile App (PWA)

This app is a **Progressive Web App (PWA)**, meaning you don't need the App Store or Play Store to install it. It works natively on your phone.

### Installation on iOS (iPhone/iPad)
1. Open the deployed website URL in **Safari**.
2. Tap the **Share** button (square with an up arrow) at the bottom.
3. Scroll down and tap **"Add to Home Screen"**.
4. The app will now appear on your home screen like a regular app!

### Installation on Android
1. Open the deployed website URL in **Chrome**.
2. Tap the **three dots** in the top-right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. Follow the prompts to add it to your device.

---

## 🔄 Mobile Sync Feature

To move your data from your computer to your phone:
1. Open the app on your computer.
2. Go to **Settings** > **Mobile Sync**.
3. Click **"Generate Sync QR Code"**.
4. Open your phone's camera and scan the QR code.
5. Tap the link to open the app on your phone.
6. Confirm the data import. Your tasks are now on your phone!

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app uses `localStorage` to save your data locally on your device. No backend required!
