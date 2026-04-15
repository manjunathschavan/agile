# 🎯 Authentication Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
                        INITIAL APP LOAD
═══════════════════════════════════════════════════════════════════

                    User Opens App
                          ↓
              ┌───────────────────────┐
              │  Check LocalStorage   │
              │  for 'currentUser'    │
              └───────────┬───────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
    Session Found                 No Session
            │                           │
            ↓                           ↓
    ┌───────────────┐          ┌──────────────┐
    │ Auto-Login    │          │ Show "Sign   │
    │ Set user data │          │ In" button   │
    │ Show sidebar  │          │ in sidebar   │
    └───────────────┘          └──────────────┘
            │
            ↓
    User sees their
    avatar & name


═══════════════════════════════════════════════════════════════════
                          LOGIN FLOW
═══════════════════════════════════════════════════════════════════

    User clicks "Sign In"
            ↓
    ┌──────────────────────────┐
    │   LOGIN PAGE             │
    │   /login                 │
    │                          │
    │  ┌────────────────────┐  │
    │  │ 🔐 ClubHub Logo    │  │
    │  │ Welcome Message    │  │
    │  └────────────────────┘  │
    │                          │
    │  ┌────────────────────┐  │
    │  │ Email Input        │  │
    │  │ Password Input     │  │
    │  │ [👁️ Show/Hide]    │  │
    │  │                    │  │
    │  │ ☐ Remember Me      │  │
    │  │                    │  │
    │  │ [Sign In Button]   │  │
    │  └────────────────────┘  │
    │                          │
    │  Demo Credentials Box    │
    │  (3 accounts shown)      │
    └──────────────────────────┘
            ↓
    User enters credentials
            ↓
    Click "Sign In"
            ↓
    ┌──────────────────────┐
    │  VALIDATION          │
    │  (1 second delay)    │
    │                      │
    │  [Loading spinner]   │
    │  "Signing in..."     │
    └──────────┬───────────┘
               │
    ┌──────────┴──────────┐
    │                     │
  Valid              Invalid
    │                     │
    ↓                     ↓
┌─────────┐         ┌──────────────┐
│ SUCCESS │         │   ERROR      │
└────┬────┘         │ Show Alert   │
     │              │ "Invalid     │
     │              │ credentials" │
     ↓              └──────────────┘
Store in localStorage
Set user state
     ↓
Show success toast
     ↓
Redirect to /profile


═══════════════════════════════════════════════════════════════════
                        PROFILE PAGE
═══════════════════════════════════════════════════════════════════

    After successful login
            ↓
    ┌──────────────────────────────────────────┐
    │         PROFILE PAGE /profile            │
    │                                          │
    │  ┌────────────────────────────────────┐  │
    │  │  [Avatar] Priya Sharma  [Student]  │  │
    │  │  priya.sharma@college.edu          │  │
    │  │  S2023045 • Computer Science       │  │
    │  │  [Edit] [Logout]                   │  │
    │  └────────────────────────────────────┘  │
    │                                          │
    │  ┌────────────────────────────────────┐  │
    │  │ [Details] [Clubs] [Payments] [⚙️]  │  │
    │  └────────────────────────────────────┘  │
    │                                          │
    │  TAB 1: PERSONAL DETAILS                │
    │  ┌────────────────────────────────────┐  │
    │  │ Name:       Priya Sharma    [Edit] │  │
    │  │ Email:      priya@...              │  │
    │  │ Phone:      +91 98765 43210        │  │
    │  │ Student ID: S2023045               │  │
    │  │ Department: Computer Science       │  │
    │  │ Year:       Third Year             │  │
    │  └────────────────────────────────────┘  │
    │                                          │
    │  TAB 2: MY CLUBS                        │
    │  ┌────────────────────────────────────┐  │
    │  │ 💻 Computer Science Society        │  │
    │  │ 🎭 Drama Club                      │  │
    │  └────────────────────────────────────┘  │
    │                                          │
    │  TAB 3: PAYMENT HISTORY                 │
    │  ┌────────────────────────────────────┐  │
    │  │ Total Spent: ₹3,386.56             │  │
    │  │ Transactions: 8                    │  │
    │  │ Completed: 7                       │  │
    │  │                                    │  │
    │  │ Recent Transactions:               │  │
    │  │ • Spring Musical - ₹423.30         │  │
    │  │ • ...                              │  │
    │  │ [View All]                         │  │
    │  └────────────────────────────────────┘  │
    │                                          │
    │  TAB 4: SETTINGS                        │
    │  ┌────────────────────────────────────┐  │
    │  │ [Manage Payment Methods]           │  │
    │  │ [Notification Preferences]         │  │
    │  │ [Email Settings]                   │  │
    │  │                                    │  │
    │  │ ────────────────────               │  │
    │  │ [Sign Out]                         │  │
    │  └────────────────────────────────────┘  │
    └──────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                      NAVIGATION INTEGRATION
═══════════════════════════════════════════════════════════════════

Desktop Sidebar:
┌────────────────────────┐
│ ClubHub                │
│ College Event Manager  │
├────────────────────────┤
│ 📊 Dashboard           │
│ 📅 Events              │
│ 📆 Calendar            │
│ 🏛️ Clubs               │
│ 👥 Attendees           │
│ 💳 Payments            │
├────────────────────────┤
│ [+ Create Event]       │
├────────────────────────┤
│ ┌────────────────────┐ │
│ │ [Avatar]           │ │
│ │ Priya Sharma       │ │
│ │ priya@college.edu  │ │
│ │        [▼]         │ │
│ └────────────────────┘ │
└────────────────────────┘
           │
           │ Click Avatar
           ↓
    ┌──────────────────┐
    │  Dropdown Menu   │
    ├──────────────────┤
    │ 👤 Profile       │
    │ 💳 Payment       │
    │    Settings      │
    ├──────────────────┤
    │ 🚪 Logout        │
    └──────────────────┘


Mobile Header:
┌────────────────────────────┐
│ ClubHub   [Avatar] [≡]     │
└────────────────────────────┘
              │       │
              │       └─→ Menu
              │
              └─→ User Dropdown
                  ├─ Profile
                  ├─ Payment Settings
                  └─ Logout


═══════════════════════════════════════════════════════════════════
                          LOGOUT FLOW
═══════════════════════════════════════════════════════════════════

    User clicks "Logout"
    (from dropdown or profile)
            ↓
    ┌──────────────────────┐
    │  LOGOUT PROCESS      │
    │                      │
    │  1. Clear user state │
    │  2. Remove from      │
    │     localStorage     │
    │  3. Reset auth       │
    └──────────┬───────────┘
               ↓
    Show toast: "Logged out successfully"
               ↓
    Redirect to /login
               ↓
    User sees login page again


═══════════════════════════════════════════════════════════════════
                      SESSION PERSISTENCE
═══════════════════════════════════════════════════════════════════

Scenario 1: Page Refresh
┌────────────────────────┐
│ User is logged in      │
│ Viewing any page       │
└───────────┬────────────┘
            │
    Press F5 (Refresh)
            │
            ↓
┌────────────────────────┐
│ App loads              │
│ Check localStorage     │
│ Find 'currentUser'     │
└───────────┬────────────┘
            │
            ↓
┌────────────────────────┐
│ Auto-login             │
│ User stays logged in   │
│ Same page restored     │
└────────────────────────┘


Scenario 2: Close & Reopen
┌────────────────────────┐
│ User logged in         │
│ Close browser tab      │
└───────────┬────────────┘
            │
    Wait 10 minutes
            │
            ↓
┌────────────────────────┐
│ Open app again         │
└───────────┬────────────┘
            │
            ↓
┌────────────────────────┐
│ Still logged in!       │
│ Session persists       │
│ No re-login needed     │
└────────────────────────┘


Scenario 3: Logout & Refresh
┌────────────────────────┐
│ User clicks logout     │
│ Redirected to /login   │
└───────────┬────────────┘
            │
    Press F5 (Refresh)
            │
            ↓
┌────────────────────────┐
│ No session found       │
│ Stays on login page    │
│ Must login again       │
└────────────────────────┘


═══════════════════════════════════════════════════════════════════
                      ROLE-BASED FEATURES
═══════════════════════════════════════════════════════════════════

User Roles:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  👨‍🎓 STUDENT                                        │
│  • View events                                      │
│  • Register for events                              │
│  • Join clubs                                       │
│  • Make payments                                    │
│  • View own profile                                 │
│                                                     │
│  👔 CLUB ADMIN                                      │
│  • All student features                             │
│  • Create events for their club                     │
│  • Manage club members                              │
│  • View club analytics                              │
│  • Track event payments                             │
│                                                     │
│  👨‍💼 ADMINISTRATOR                                   │
│  • All features                                     │
│  • Manage all clubs                                 │
│  • View all analytics                               │
│  • System settings                                  │
│  • User management                                  │
│                                                     │
└─────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                      DATA STRUCTURE
═══════════════════════════════════════════════════════════════════

LocalStorage:
┌─────────────────────────────────────────────────────┐
│ Key: "currentUser"                                  │
│                                                     │
│ Value: {                                            │
│   id: "USER001",                                    │
│   name: "Priya Sharma",                             │
│   email: "priya.sharma@college.edu",                │
│   studentId: "S2023045",                            │
│   department: "Computer Science",                   │
│   year: "Third Year",                               │
│   phone: "+91 98765 43210",                         │
│   avatar: "https://...",                            │
│   role: "student",                                  │
│   clubs: ["CS Society", "Drama Club"],              │
│   joinDate: "2023-08-15"                            │
│ }                                                   │
└─────────────────────────────────────────────────────┘


AuthContext State:
┌─────────────────────────────────────────────────────┐
│ {                                                   │
│   user: User | null,                                │
│   isAuthenticated: boolean,                         │
│   login: (email, password) => Promise<boolean>,     │
│   logout: () => void,                               │
│   updateProfile: (data) => void                     │
│ }                                                   │
└─────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                      KEY COMPONENTS
═══════════════════════════════════════════════════════════════════

┌────────────────────────────────────────────────────┐
│ AuthContext.tsx                                    │
│ • Provides auth state to entire app                │
│ • Manages login/logout                             │
│ • Handles session persistence                      │
│ • Updates user profile                             │
└────────────────────────────────────────────────────┘
                        ↓ provides to
┌────────────────────────────────────────────────────┐
│ App.tsx (wrapped with AuthProvider)                │
└────────────────────────────────────────────────────┘
                        ↓ uses in
┌─────────────────────┬──────────────┬───────────────┐
│ LoginPage.tsx       │ ProfilePage  │ Navigation    │
│ • Login form        │ • User info  │ • Avatar      │
│ • Validation        │ • Tabs       │ • Dropdown    │
│ • Demo accounts     │ • Edit mode  │ • Logout      │
└─────────────────────┴──────────────┴───────────────┘


═══════════════════════════════════════════════════════════════════

This complete authentication system provides a seamless login and
profile management experience for the ClubHub application! 🚀
