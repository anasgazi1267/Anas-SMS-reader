# Anas SMS Reader

A mobile application for automatic payment confirmation from bKash/Nagad SMS messages.

## Overview

This app monitors incoming SMS from Bangladeshi payment providers (bKash, Nagad, Rocket, Upay) and automatically extracts payment information to send to a webhook endpoint.

## Features

- **SMS Monitoring**: Listens for incoming SMS from payment providers
- **Auto-parsing**: Extracts amount (Tk/BDT/Taka patterns) and transaction IDs
- **Webhook Integration**: Sends parsed data to configured webhook URL
- **Activity Log**: Shows last 5 processed SMS messages with status
- **Simple UI**: Large Start/Stop button with clear status display

## Architecture

### Frontend (Expo/React Native)
- **client/screens/SMSReaderScreen.tsx**: Main dashboard with service controls and SMS log
- **client/lib/sms-service.ts**: SMS parsing utilities, webhook logic, and storage
- **client/components/**: Reusable UI components (Button, Card, ThemedText, etc.)
- **client/navigation/**: Single-screen stack navigation

### Backend (Express)
- **server/index.ts**: Express server for static file serving
- Minimal backend as app logic is primarily client-side

## Important Notes

### Expo Limitations
This app uses Expo which has limitations for native SMS functionality:
- **Expo Go**: Cannot access SMS permissions (RECEIVE_SMS, READ_SMS)
- **Web Version**: Uses simulation for testing purposes
- **Production APK**: Would require Expo development build with custom native modules

### Webhook Configuration
The app sends POST requests to:
```
https://jleugjmibejzobcsnwmu.supabase.co/functions/v1/sms-confirm
```

JSON payload format:
```json
{
  "sender": "bKash",
  "message": "You have received Tk 5,000.00 from 01712345678. TrxID: ABC123XYZ",
  "amount": "5000.00",
  "trxId": "ABC123XYZ"
}
```

## Running the App

### Development
```bash
npm run all:dev
```

### Testing
- Web: Access via browser at the development URL
- Mobile: Scan QR code with Expo Go (limited functionality)
- Use "Simulate Incoming SMS" button on web to test the flow

## File Structure

```
client/
├── App.tsx                 # Root component with providers
├── screens/
│   └── SMSReaderScreen.tsx # Main SMS reader dashboard
├── lib/
│   └── sms-service.ts      # SMS utilities and webhook logic
├── components/             # Reusable UI components
├── constants/
│   └── theme.ts            # Design tokens and colors
└── navigation/
    └── RootStackNavigator.tsx

server/
├── index.ts               # Express server entry
└── routes.ts              # API routes

assets/images/             # App icons and splash screens
```

## Provider Detection

The app detects payment providers by checking if sender contains:
- BKASH → bKash (pink badge)
- NAGAD → Nagad (orange-red badge)
- ROCKET → Rocket (purple badge)
- UPAY → Upay (red badge)

## Amount Parsing Patterns

Supported patterns:
- `Tk 5,000.00` or `Tk. 5000`
- `BDT 5,000.00`
- `Taka 5,000.00`
- `5,000.00 Tk` (amount before currency)

## Transaction ID Patterns

Supported patterns:
- `TrxID: ABC123`
- `Trx ID: ABC123`
- `Transaction ID: ABC123`
- `Trans. ID: ABC123`
- `TxnId: ABC123`
