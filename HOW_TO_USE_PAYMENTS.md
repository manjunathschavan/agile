# 🎯 How to Use the Payment System

## Quick Start Guide

### For Users

#### 1. **Making a Payment for an Event**

**Step-by-Step:**
1. Navigate to the **Events** page from the sidebar
2. Find an event with a price (e.g., "Spring Musical: Hamilton - ₹415")
3. Click on the event card to view details
4. On the Event Detail page, you'll see:
   - Event information
   - Entry Fee: ₹415.00
   - Registration section on the right sidebar
5. Click the **"Register"** or **"RSVP Now"** button
6. The Payment Dialog will open automatically (for paid events)

**Payment Dialog Options:**
- **Option A: Card Payment**
  - Select "Credit / Debit Card"
  - Enter card details:
    - Card Number: `4532 1234 5678 9012` (auto-formats with spaces)
    - Cardholder Name: Your name
    - Expiry Date: `12/26` (auto-formats as MM/YY)
    - CVV: `123` (3 digits)
  - Review the fees:
    - Registration Fee: ₹415.00
    - Processing Fee (2%): ₹8.30
    - **Total: ₹423.30**
  - Click **"Pay ₹423.30"**

- **Option B: UPI / Digital Wallet**
  - Select "Digital Wallet / UPI"
  - Click **"Pay ₹423.30"**
  - You'll see a message about being redirected to your UPI app
  - In production, you would scan a QR code or be redirected

7. **Wait for Processing** (⏳ 2 seconds)
8. **Success Screen** appears with:
   - ✅ Checkmark
   - Transaction ID (save this!)
   - Payment summary
   - "Done" button
9. Click **"Done"** to close the dialog
10. You'll see **"Registered ✓"** on the event page

---

#### 2. **Viewing Payment History**

1. Click **"Payments"** in the sidebar menu
2. You'll see the Payments Dashboard with:
   - **Analytics Cards** at the top:
     - Total Revenue
     - Total Transactions
     - Success Rate
     - Average Transaction
   - **Filter Controls:**
     - Search box (search by event name or transaction ID)
     - Status filter dropdown (All/Completed/Pending/Refunded)
     - Sort dropdown (Date/Amount)
   - **Transaction History:**
     - List of all transactions
     - Each showing: Event name, Transaction ID, Date, Amount, Payment method, Status

3. **Download a Receipt:**
   - Find any transaction
   - Click the download icon (📥) on the right
   - A `.txt` receipt file will be downloaded with all details

---

#### 3. **Managing Payment Methods**

1. Go to **Payments** page
2. Click the **"Settings"** button (top-right, near the page title)
3. You'll see the **Payment Settings** page with:
   - Your saved payment methods (3 cards pre-saved)
   - Each card shows:
     - Card type (Visa/Mastercard/RuPay)
     - Last 4 digits
     - Cardholder name
     - Expiry date
     - "Default" badge (if applicable)

4. **Add a New Card:**
   - Click **"+ Add Card"**
   - Fill in the form:
     - Card Number (auto-formats)
     - Cardholder Name
     - Expiry Date (MM/YY)
     - CVV
   - Click **"Add Card"**
   - Success toast appears
   - Card is added to your list

5. **Set a Default Card:**
   - Find a non-default card
   - Click **"Set Default"**
   - That card becomes your default payment method

6. **Delete a Card:**
   - Find the card you want to remove
   - Click the red trash icon (🗑️)
   - Card is removed
   - Success toast appears

---

### For Developers

#### Testing Cards

Use these test cards for development:

```javascript
// Visa
Card: 4532 1234 5678 9012
Type: Visa (starts with 4)

// Mastercard
Card: 5425 1234 5678 9012
Type: Mastercard (starts with 5)

// RuPay
Card: 6074 1234 5678 9012
Type: RuPay (starts with 6)

// Any
Name: Any name
Expiry: Any future date (12/26, 03/27, etc.)
CVV: Any 3 digits (123, 456, etc.)
```

#### Accessing Transaction Data

```typescript
// Read transactions from localStorage
const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

// Transaction structure:
interface Transaction {
  id: string;                 // "TXN1733492850ABC123"
  eventId: string;            // "2"
  eventTitle: string;         // "Spring Musical: Hamilton"
  amount: number;             // 423.30 (includes 2% fee)
  paymentMethod: string;      // "Credit/Debit Card" or "UPI / Digital Wallet"
  date: string;               // "2026-04-05T10:30:00.000Z"
  status: string;             // "completed", "pending", "refunded"
}
```

#### Triggering Payment Dialog

```typescript
// In your component
import { PaymentDialog } from '../components/PaymentDialog';
import { useState } from 'react';

// State
const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

// Handler
const handlePaymentSuccess = (transactionId: string) => {
  console.log('Payment successful:', transactionId);
  // Do something with the transaction ID
};

// Render
<PaymentDialog
  open={isPaymentDialogOpen}
  onOpenChange={setIsPaymentDialogOpen}
  eventTitle="Your Event Name"
  amount={415} // Base amount in rupees
  eventId="event-id-123"
  onPaymentSuccess={handlePaymentSuccess}
/>
```

#### Initial Data

The system comes pre-loaded with:
- **8 sample transactions** (all for Spring Musical: Hamilton)
- **3 saved payment methods** (Visa, Mastercard, RuPay)
- **Total initial revenue:** ₹3,386.56

To reset to initial state:
```javascript
// Clear localStorage
localStorage.removeItem('transactions');

// Reload the page - initial transactions will be loaded automatically
```

---

## Features Summary

### ✅ Current Features (Implemented)

1. **Complete Payment Flow**
   - Event registration with payment
   - Card and UPI payment methods
   - Real-time form validation
   - Success confirmation
   - Transaction storage

2. **Transaction Management**
   - View all transactions
   - Search and filter
   - Sort by date/amount
   - Download receipts
   - Status tracking

3. **Payment Methods**
   - Save multiple cards
   - Set default card
   - Card type detection
   - Secure storage (masked)
   - Add/delete cards

4. **Indian Context**
   - Rupee (₹) currency
   - UPI/Digital Wallet support
   - Indian payment apps
   - RuPay card support
   - Indian names and data

5. **UI/UX**
   - Fully responsive
   - Mobile-friendly
   - Toast notifications
   - Loading states
   - Error handling

---

## 🚀 Future Enhancements (Not Implemented)

When moving to production, consider adding:

1. **Real Payment Gateway**
   - Integrate Razorpay
   - Or Paytm Payment Gateway
   - Or Stripe India
   - Webhook handling

2. **Backend API**
   ```
   POST /api/payments/create
   POST /api/payments/verify
   POST /api/payments/refund
   GET  /api/payments/history
   ```

3. **Enhanced Security**
   - Server-side validation
   - Token-based auth
   - OTP verification
   - 3D Secure
   - Fraud detection

4. **Additional Features**
   - Email receipts
   - SMS notifications
   - Invoice generation
   - Refund processing
   - Subscription payments
   - Installment options

5. **Advanced Analytics**
   - Revenue trends
   - Payment method distribution
   - Peak payment times
   - Failed transaction analysis
   - Export to CSV/Excel

---

## 📱 Mobile Experience

The payment system is fully optimized for mobile:

- **Responsive Design:** Works on all screen sizes
- **Touch-Friendly:** Large buttons and inputs
- **Mobile Menu:** Collapsible navigation
- **Card Input:** Native mobile keyboard
- **Fast Loading:** Optimized assets
- **Swipe Actions:** Touch gestures (future)

---

## 🔒 Security Notes

**Current Implementation (Mock):**
- Client-side validation only
- Data stored in localStorage
- No real payment processing
- For development/demo purposes

**Production Requirements:**
- HTTPS/SSL encryption
- Server-side validation
- PCI DSS compliant gateway
- No sensitive data in localStorage
- Token-based authentication
- Audit logging

---

## 📞 Support

For issues or questions:
- Email: support@clubhub.edu
- Phone: +91-1234567890
- Payment Gateway: [Future integration docs]

---

## 🎉 That's It!

The payment system is fully integrated and ready to use. Start by:
1. Navigating to any paid event
2. Clicking Register
3. Making a test payment
4. Viewing your transaction in Payments page

**Enjoy the seamless payment experience! 💳🚀**
