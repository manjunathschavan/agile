# Payment System Architecture

## Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER JOURNEY - PAYMENT FLOW                  │
└─────────────────────────────────────────────────────────────────┘

1. EVENT DISCOVERY
   ┌──────────────┐
   │ Events Page  │
   │ or Dashboard │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Event Detail │
   │ Page         │
   └──────┬───────┘
          │
          │ View Entry Fee: ₹415
          │
          ▼
   ┌──────────────┐
   │ Click        │
   │ "Register"   │
   └──────┬───────┘
          │
          │ (If Paid Event)
          │
          ▼

2. PAYMENT DIALOG
   ┌──────────────────────────────────┐
   │   Payment Dialog Opens           │
   │                                  │
   │   ┌────────────────────────┐    │
   │   │ Registration Fee       │    │
   │   │ ₹415.00                │    │
   │   │                        │    │
   │   │ Processing Fee (2%)    │    │
   │   │ ₹8.30                  │    │
   │   │ ─────────────────────  │    │
   │   │ Total: ₹423.30         │    │
   │   └────────────────────────┘    │
   │                                  │
   │   Choose Payment Method:         │
   │   ○ Credit/Debit Card           │
   │   ○ UPI / Digital Wallet        │
   └──────────────┬───────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
      ▼                       ▼
┌─────────────┐      ┌────────────────┐
│  CARD       │      │  UPI/WALLET    │
│  Payment    │      │  Payment       │
└─────┬───────┘      └────────┬───────┘
      │                       │
      │ Enter:                │ Redirect to:
      │ • Card No.            │ • PhonePe
      │ • Name                │ • Google Pay
      │ • Expiry              │ • Paytm
      │ • CVV                 │ • Any UPI
      │                       │
      └───────────┬───────────┘
                  │
                  ▼
            ┌──────────┐
            │Processing│ ⏳ 2 seconds
            └─────┬────┘
                  │
                  ▼

3. PAYMENT SUCCESS
   ┌─────────────────────────────────┐
   │     ✅ Payment Successful        │
   │                                  │
   │   Transaction ID:                │
   │   TXN1733492850ABC123            │
   │                                  │
   │   Event: Spring Musical          │
   │   Amount: ₹423.30                │
   │   Method: Credit/Debit Card      │
   │   Status: Completed              │
   │                                  │
   │   [Done] ────────────────────    │
   └──────────────┬──────────────────┘
                  │
                  │ (Save to localStorage)
                  │
                  ▼
            ┌─────────────┐
            │ Registration│
            │ Confirmed   │
            │      ✓      │
            └─────────────┘

4. POST-PAYMENT OPTIONS
   ┌─────────────────────────────────────────┐
   │                                         │
   │  View in Payments Page:                 │
   │  • See transaction in history           │
   │  • Download receipt                     │
   │  • Filter/search transactions           │
   │                                         │
   │  Manage Payment Methods:                │
   │  • Add new card                         │
   │  • Set default payment method           │
   │  • Remove old cards                     │
   │                                         │
   │  Event Page:                            │
   │  • Shows "Registered ✓"                 │
   │  • Can view attendee details            │
   │                                         │
   └─────────────────────────────────────────┘
```

## Data Storage Structure

```
localStorage
│
├── transactions (Array)
│   └── [
│       {
│         id: "TXN1733492850ABC123",
│         eventId: "2",
│         eventTitle: "Spring Musical: Hamilton",
│         amount: 423.30,
│         paymentMethod: "Credit/Debit Card",
│         date: "2026-04-05T10:30:00.000Z",
│         status: "completed"
│       },
│       ...
│     ]
│
└── (Future: savedPaymentMethods, userPreferences, etc.)
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          App.tsx                                 │
│                       (RouterProvider)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  RootLayout    │
                    │  (Navigation)  │
                    └────────┬───────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐
│ EventDetailPage │  │PaymentsPage │  │PaymentSettings  │
│                 │  │             │  │Page             │
│ ┌─────────────┐ │  │ • Stats     │  │                 │
│ │Registration │ │  │ • Search    │  │ • Saved Cards   │
│ │   Section   │ │  │ • Filters   │  │ • Add Card      │
│ │             │ │  │ • History   │  │ • Set Default   │
│ │ [Register]  │ │  │ • Download  │  │ • Delete Card   │
│ └──────┬──────┘ │  │             │  │                 │
│        │        │  └─────────────┘  └─────────────────┘
└────────┼────────┘
         │
         │ (Opens on click)
         ▼
┌───────────────────┐
│  PaymentDialog    │
│  (Modal)          │
│                   │
│  • Amount Display │
│  • Method Select  │
│  • Card Form      │
│  • UPI Option     │
│  • Processing     │
│  • Success Screen │
└───────────────────┘
```

## Payment Methods Supported

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT METHODS                          │
└─────────────────────────────────────────────────────────────┘

1. CREDIT/DEBIT CARDS
   ┌──────────────────┐
   │  💳 Visa         │  → Card No: 4xxx xxxx xxxx xxxx
   │  💳 Mastercard   │  → Card No: 5xxx xxxx xxxx xxxx
   │  💳 RuPay        │  → Card No: 6xxx xxxx xxxx xxxx
   └──────────────────┘
   Required: Card No., Name, Expiry, CVV

2. DIGITAL WALLETS / UPI
   ┌──────────────────┐
   │  📱 PhonePe      │
   │  📱 Google Pay   │
   │  📱 Paytm        │
   │  📱 Any UPI App  │
   └──────────────────┘
   Process: Redirect → Pay → Return

3. FEE STRUCTURE
   ┌────────────────────────────────┐
   │  Registration Fee    ₹415.00   │
   │  Processing Fee (2%) ₹8.30     │
   │  ─────────────────────────     │
   │  Total Amount        ₹423.30   │
   └────────────────────────────────┘
```

## Transaction States

```
   ┌─────────┐
   │ PENDING │ → Initial state when created
   └────┬────┘
        │
        │ (Payment processing)
        │
        ▼
   ┌───────────┐
   │ COMPLETED │ → Payment successful, transaction recorded
   └───────────┘
        │
        │ (If needed)
        │
        ▼
   ┌──────────┐
   │ REFUNDED │ → Payment reversed (future feature)
   └──────────┘
        │
        │ (If failed)
        │
        ▼
   ┌─────────┐
   │ FAILED  │ → Payment unsuccessful (future feature)
   └─────────┘
```

## Security Features

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY MEASURES                         │
└─────────────────────────────────────────────────────────────┘

1. CLIENT-SIDE (Current Mock Implementation)
   • Card number validation (16 digits)
   • CVV validation (3 digits)
   • Expiry date validation
   • Input masking for sensitive data
   • No storage of full card numbers
   • No storage of CVV

2. FUTURE PRODUCTION FEATURES
   • 🔒 HTTPS/SSL encryption
   • 🔐 Token-based authentication
   • 🏦 PCI DSS compliant gateway
   • 🛡️ Fraud detection
   • 📧 Email verification
   • 🔑 Two-factor authentication
   • 📱 OTP verification
   • 🌐 3D Secure (Verified by Visa, Mastercard SecureCode)

3. DATA PRIVACY
   • Minimal data storage
   • Transaction IDs for tracking
   • No plain text sensitive data
   • User consent and terms
```

## Receipt Format

```
═══════════════════════════════════════
        PAYMENT RECEIPT
═══════════════════════════════════════

Transaction ID: TXN1733492850ABC123
Event: Spring Musical: Hamilton
Amount: ₹423.30
Payment Method: Credit/Debit Card
Date: 05 April 2026, 10:30
Status: COMPLETED

═══════════════════════════════════════
Thank you for your payment!

For any queries, contact:
support@clubhub.edu
+91-1234567890
═══════════════════════════════════════
```

## Pages & Routes

```
┌─────────────────────────────────────────────────────────────┐
│                      ROUTE STRUCTURE                         │
└─────────────────────────────────────────────────────────────┘

/                           → Dashboard (shows revenue stats)
/events                     → Events List
/events/:id                 → Event Detail (with payment button)
/payments                   → Payments Dashboard
/payment-settings           → Payment Methods Management
/calendar                   → Calendar View
/clubs                      → Clubs List (with budgets)
/attendees                  → Attendees Management
/create-event               → Create New Event Form
```

This architecture provides a complete, scalable payment system ready for production with real payment gateway integration!
