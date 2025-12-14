# Anas SMS Reader

## Overview
A native Android app for automatic payment confirmation from bKash/Nagad SMS. The app monitors incoming SMS from Bangladesh mobile payment providers (bKash, Nagad, Rocket, Upay), parses payment details, and sends them to a webhook.

## Current State
- MVP completed with full UI implementation
- SMS service logic implemented (parsing, webhook integration)
- Web preview available with simulation capabilities
- Ready for testing on Expo Go

## Architecture

### Frontend (Expo/React Native)
- **Main Screen**: SMSReaderScreen with Start/Stop service controls
- **Components**: StatusCard, ServiceButton, SMSLogItem
- **Service Layer**: sms-service.ts handles parsing and webhook communication

### Backend (Express)
- Minimal backend serving the Expo app
- No database required (logs stored in AsyncStorage)

## Key Features
1. **Service Control**: Big Start/Stop button with visual feedback
2. **Payment Detection**: Automatic parsing of bKash, Nagad, Rocket, Upay SMS
3. **Amount Parsing**: Detects Tk/BDT/Taka patterns
4. **Transaction ID Parsing**: Extracts TrxID from various formats
5. **Webhook Integration**: Sends parsed data to Supabase function
6. **Activity Log**: Shows last 5 processed SMS with status

## Webhook Configuration
- **URL**: https://jleugjmibejzobcsnwmu.supabase.co/functions/v1/sms-confirm
- **Method**: POST
- **Headers**: Content-Type: application/json
- **Body**: { sender, message, amount, trxId }

## Important Notes

### SMS Reading Limitations
**This app uses Expo which has limitations for SMS reading:**
- SMS permissions (RECEIVE_SMS, READ_SMS) require native Android code
- Expo Go does not support native SMS reading
- For full functionality, a custom development build with native modules is needed

### For Production APK
To generate a production APK with SMS reading:
1. Eject from Expo managed workflow or use EAS Build
2. Add react-native-android-sms-listener or similar native module
3. Configure proper Android permissions in AndroidManifest.xml
4. Build with EAS Build: `eas build --platform android --profile production`

### Web Preview
The web version includes a "Simulate Incoming SMS" button for testing the parsing and webhook functionality without actual SMS reading.

## File Structure
```
client/
├── screens/
│   └── SMSReaderScreen.tsx    # Main app screen
├── lib/
│   └── sms-service.ts         # SMS parsing and webhook logic
├── components/
│   ├── ThemedText.tsx         # Typography component
│   ├── ThemedView.tsx         # Themed container
│   └── ...
├── constants/
│   └── theme.ts               # Material Design colors and spacing
└── navigation/
    └── RootStackNavigator.tsx # Single screen navigation
```

## Running the App
- **Development**: `npm run all:dev`
- **Expo Go**: Scan QR code from terminal
- **Web**: http://localhost:8081

## User Preferences
- Material Design styling with deep blue primary color
- Provider-specific badge colors (bKash pink, Nagad orange, etc.)
- Clean, professional utility app aesthetic
