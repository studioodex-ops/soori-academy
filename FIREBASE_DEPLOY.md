# With Soori Academy - Firebase Deployment Guide

## 🚀 Firebase උඩ Deploy කරන්නේ කොහොමද?

### Step 1: Firebase CLI Install කරන්න

```bash
npm install -g firebase-tools
```

### Step 2: Firebase Login කරන්න

```bash
firebase login
```

### Step 3: Firebase Project Create කරන්න

Firebase Console උඩ new project create කරන්න:
- https://console.firebase.google.com/
- Project name: `soori-academy` (ඔයා කැමති නම)
- Firestore Database enable කරන්න

### Step 4: Project ID Update කරන්න

`.firebaserc` file එකේ `soori-academy` ඔයාගේ Firebase project ID එකට change කරන්න:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### Step 5: Dependencies Install කරන්න

```bash
# Functions dependencies
cd functions
npm install

# Web dependencies
cd ../web
npm install
```

### Step 6: Admin Password Config කරන්න

```bash
firebase functions:config:set admin.password="your-new-password"
```

### Step 7: Build & Deploy

```bash
# Web build
cd web
npm run build

# Deploy to Firebase
cd ..
firebase deploy
```

---

## 📁 Project Structure

```
Facebook-Ad-Academyzip/
├── firebase.json          # Firebase config
├── firestore.rules        # Database rules
├── .firebaserc            # Project ID
├── functions/             # Backend API (Cloud Functions)
│   ├── src/
│   │   └── index.ts       # All API routes
│   ├── package.json
│   └── tsconfig.json
├── web/                   # Frontend (React)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── home.tsx   # Main website
│   │   │   └── admin.tsx  # Admin panel
│   │   ├── components/ui/
│   │   ├── hooks/
│   │   └── index.css
│   ├── public/
│   │   └── channels4_profile_...jpg
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│   └── tsconfig.json
```

---

## 🔗 Deployed URLs

Deploy කරපු පස්සේ URLs:

| Page | URL |
|------|-----|
| **Website** | `https://your-project-id.web.app/` |
| **Admin Panel** | `https://your-project-id.web.app/admin` |
| **API** | `https://your-project-id.web.app/api/` |

---

## 🔐 Admin Login

Default password: `soori2024`

Password change කරන්න:
```bash
firebase functions:config:set admin.password="new-password"
firebase deploy --only functions
```

---

## 🧪 Local Testing (Firebase Emulator)

```bash
# Start emulator
firebase emulators:start

# Web dev server (proxy to emulator)
cd web
npm run dev
```

---

## 📊 Firestore Collections

| Collection | Description |
|------------|-------------|
| `students` | Student registrations |
| `payments` | Payment receipts & status |
| `zoomSessions` | Zoom links per batch |
| `siteSettings` | All website content (editable from admin) |
| `adminMessages` | Messages to students |

---

## ❓ Problems?

### Build Error
```bash
cd functions && npm install && npm run build
cd web && npm install && npm run build
```

### Permission Error
Firestore rules check කරන්න - `firestore.rules` file

### API Not Working
Firebase Functions logs check කරන්න:
```bash
firebase functions:log
```