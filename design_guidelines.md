# Design Guidelines: Anas SMS Reader

## Architecture Decisions

### Authentication
**No Authentication Required**
- This is a single-user utility app with local functionality
- No backend user accounts or sync features
- Data is processed and forwarded but not stored for the user

### Navigation
**Stack-Only Navigation**
- Single main screen architecture
- No tabs or drawer needed
- Permission request screens appear as system dialogs
- Settings accessible via header button if needed

### Screen Specifications

#### Main Screen (SMS Reader Dashboard)
**Purpose:** Control the SMS monitoring service and view recent payment SMS activity

**Layout:**
- **Header:**
  - Default Android navigation header
  - Title: "Anas SMS Reader"
  - Right button: Settings icon (optional, for future webhook URL configuration)
  - Header should use Material Design elevated app bar style
  
- **Main Content Area:**
  - Root view: Scrollable (ScrollView)
  - Top section: Service control (fixed, non-scrolling feel)
  - Bottom section: SMS log (scrollable list within the main scroll)
  - Bottom inset: insets.bottom + Spacing.xl

**Components:**
1. **Service Status Card** (top of screen):
   - Large status indicator (running/stopped state)
   - Visual indicator: colored circle badge (green when running, gray when stopped)
   - Status text: "Service Running" or "Service Stopped"
   - Prominent color change based on state

2. **Start/Stop Button** (center, prominent):
   - Large Material Design FAB or contained button
   - Minimum height: 56dp (Material Design standard)
   - Full-width with horizontal padding: 24dp margins
   - Text: "START SERVICE" or "STOP SERVICE"
   - Background color changes based on state (primary color when stopped, secondary/error color when running)
   - Elevation: 4dp shadow when idle, 8dp when pressed

3. **Persistent Notification Reminder**:
   - Small info card below button
   - Text: "While running, you'll see: 'SMS Reader Active - Do not close'"
   - Use Material info icon
   - Subtle background (surface variant color)

4. **SMS Activity Log**:
   - Section header: "Recent Activity" with count badge "(Last 5)"
   - Each log item is a Material card:
     - Provider badge (colored chip: bKash pink, Nagad orange, Rocket purple, Upay blue)
     - Sender number
     - Amount (bold, larger text if detected)
     - Transaction ID (monospace font if detected)
     - Timestamp
     - Delivery status icon (checkmark for success, warning for error)
   - Empty state: "No SMS activity yet" with illustration
   - Card elevation: 2dp
   - Cards have 12dp spacing between them

**Safe Area Insets:**
- Top: insets.top + Spacing.xl (no custom header, using default)
- Bottom: insets.bottom + Spacing.xl
- Horizontal: Spacing.xl (24dp in Material Design)

#### Permission Request Flow
- System-level Android permission dialogs (not custom)
- On first launch, show explanation screen before requesting permissions:
  - Title: "Permission Required"
  - Body: Explain why SMS reading is needed
  - "Grant Permission" button triggers system dialog
  - Material Design outlined card with icon

## Design System

### Color Palette (Material Design 3)
**Primary Color:** Deep Blue (#1976D2) - professional, trustworthy for financial app
**Secondary Color:** Teal (#00897B) - accent for positive actions
**Error Color:** Red (#D32F2F) - for errors and stop state
**Success Color:** Green (#388E3C) - for running state and successful sends

**Surface Colors:**
- Surface: #FFFFFF
- Surface Variant: #F5F5F5
- Background: #FAFAFA

**Provider Brand Colors (for badges):**
- bKash: #E2136E (pink)
- Nagad: #EE4023 (orange-red)
- Rocket: #8B3A9C (purple)
- Upay: #D91E3A (red)

### Typography (Material Design)
- **Display Large:** Roboto 57sp (not used in this simple app)
- **Headline Medium:** Roboto Medium 28sp (screen title)
- **Title Large:** Roboto Medium 22sp (section headers)
- **Body Large:** Roboto 16sp (primary text)
- **Body Medium:** Roboto 14sp (secondary text, descriptions)
- **Label Large:** Roboto Medium 14sp (button text, all caps)
- **Label Small:** Roboto Medium 11sp (badges, timestamps)

Use Roboto as the primary font family throughout the app.

### Spacing Scale (Material Design)
- xs: 4dp
- sm: 8dp
- md: 16dp
- lg: 24dp
- xl: 32dp

### Visual Design

**Icons:**
- Use Material Design icons exclusively (from @expo/vector-icons MaterialIcons or MaterialCommunityIcons)
- Service status: circle icon or power icon
- Settings: settings/cog icon
- SMS log: message-text icon
- Success: check-circle icon
- Error: alert-circle icon
- Providers: use generic account-badge or cash icons

**Cards & Elevation:**
- Use Material Design elevation system
- Surface level 1: 2dp elevation (log cards)
- Surface level 2: 4dp elevation (status card)
- Surface level 3: 8dp elevation (FAB pressed state)

**Touch Feedback:**
- All touchable elements use Material ripple effect
- Ripple color: rgba(0, 0, 0, 0.12) on light backgrounds
- Buttons should have state layers (hover, pressed, focused)

### Interaction Design

**Start/Stop Button Behavior:**
- Tap: Immediate visual feedback with ripple
- Loading state: Show circular progress indicator while service starts/stops (2-3 seconds)
- Success: Haptic feedback + state change animation
- If permissions denied: Show error snackbar with "Open Settings" action

**Notification Behavior:**
- Persistent notification while service runs (managed by Android system)
- Transient notifications for SMS detected/sent (auto-dismiss after 5 seconds)
- Use Android notification channels: "Service Status" (high priority) and "SMS Events" (medium priority)

**SMS Log Updates:**
- New items fade in from top with slide animation
- Oldest item slides out when 6th item arrives
- Smooth 300ms animations

**Empty States:**
- SMS log: Simple illustration (message icon) with text "No SMS activity yet"
- Use subtle gray colors for empty states

### Accessibility Requirements

**Material Design Compliance:**
- Minimum touch target: 48dp × 48dp for all interactive elements
- Color contrast: Minimum 4.5:1 for body text, 3:1 for large text
- Text scaling: Support Android system font scaling up to 200%
- Screen reader: All buttons and cards have content descriptions
  - Start button: "Start SMS monitoring service"
  - Stop button: "Stop SMS monitoring service"
  - Log items: "Payment SMS from [provider], amount [amount], transaction ID [id], [status]"

**Focus Management:**
- Clear focus indicators (outline) when using external keyboard
- Logical focus order: Status → Button → Log items

**Error Handling:**
- Permission denied: Clear error message with actionable "Open Settings" button
- Network error: Snackbar with retry option
- Parse error: Log item shows "Unable to parse" with warning icon

### Critical Assets
**None Required**
- Use Material Design system icons only
- No custom imagery or illustrations needed
- Provider branding is color-based (using brand colors for badges)

This is a utility-focused app prioritizing clarity, reliability, and Material Design consistency over custom branding.