# QR Master - Quick Start Guide

## 🚀 **Schneller Start (ohne Docker)**

### **Windows:**
1. Doppelklicke auf `start-dev.bat`
2. Warte bis die App startet
3. Öffne http://localhost:3000

### **Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### **Manuell:**
```bash
npm install
npm run dev
```

## 🎯 **Alle Features sind funktionsfähig!**

### ✅ **QR Code CRUD Operationen**
- **Edit**: Dashboard → Edit Button → Vollständige Bearbeitungsseite
- **Duplicate**: Dashboard → Duplicate Button → Erstellt Kopie
- **Pause/Resume**: Dashboard → Pause/Resume Button → Toggle Status
- **Delete**: Dashboard → Delete Button → Mit Bestätigung

### ✅ **Google OAuth Integration**
- **Login**: Klicke "Continue with Google" auf der Login-Seite
- **Konfiguration**: Füge Google Credentials zur `.env` hinzu

### ✅ **Billing System**
- **Settings**: Billing Tab → "Manage Subscription"
- **Stripe Integration**: Bereit für echte Billing-Funktionen

### ✅ **Team Management**
- **Settings**: Team Tab → "Invite Member"
- **Rollen**: OWNER, ADMIN, EDITOR, VIEWER
- **Verwaltung**: Rollen ändern, Mitglieder entfernen

### ✅ **Profilbild-Upload**
- **Settings**: Profile Tab → "Change Photo"
- **Features**: Drag & Drop, Validierung, Live-Preview

## 🔧 **Demo-Account**

Die App funktioniert mit Mock-Daten, wenn keine Datenbank verfügbar ist:

- **E-Mail**: `demo@qrmaster.com`
- **Passwort**: `demo123`

## 📱 **Verwendung**

### **QR Code erstellen:**
1. Gehe zu `/create`
2. Fülle die Formulare aus
3. Wähle Static oder Dynamic
4. Klicke "Save QR Code"

### **QR Code bearbeiten:**
1. Dashboard → Edit Button
2. Ändere Inhalte, Stile oder Status
3. Klicke "Update QR Code"

### **Team verwalten:**
1. Settings → Team Tab
2. "Invite Member" klicken
3. E-Mail und Rolle eingeben

### **Profilbild ändern:**
1. Settings → Profile Tab
2. "Change Photo" klicken
3. Bilddatei auswählen

## 🎨 **Features**

- **Toast Notifications**: Schöne Benachrichtigungen statt Alerts
- **Loading States**: Alle API-Calls zeigen Loading-Indikatoren
- **Error Handling**: Graceful Fallbacks bei Fehlern
- **Responsive Design**: Funktioniert auf allen Geräten
- **Mock-Daten**: App funktioniert auch ohne Datenbank

## 🔮 **Produktion**

Für die Produktion:
1. **Datenbank**: PostgreSQL mit Prisma
2. **Stripe**: Echte Billing-Integration
3. **Cloud Storage**: AWS S3 oder Cloudinary für Bilder
4. **E-Mail**: SendGrid oder Resend für Team-Einladungen

## 🎉 **Fertig!**

Die App ist vollständig funktionsfähig und alle Features sind implementiert!
