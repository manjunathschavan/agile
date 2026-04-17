import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CreditCard, Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const ADMIN_EMAIL = 'admin@clubhub.edu';
const UPI_ID = 'clubhub@upi'; // replace with real UPI ID

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  amount: number;
  eventId: string;
  onPaymentSuccess?: (transactionId: string) => void;
}

export function PaymentDialog({
  open, onOpenChange, eventTitle, amount, eventId, onPaymentSuccess,
}: PaymentDialogProps) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [upiRef, setUpiRef] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const total = amount * 1.02;

  // UPI QR — uses UPI deep link encoded as QR via a free QR API
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=ClubHub&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(eventTitle)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const formatCardNumber = (v: string) => {
    const c = v.replace(/\s/g, '');
    return (c.match(/.{1,4}/g) || [c]).join(' ');
  };

  const formatExpiry = (v: string) => {
    const c = v.replace(/\D/g, '');
    return c.length >= 2 ? `${c.slice(0, 2)}/${c.slice(2, 4)}` : c;
  };

  const notifyAdmin = (txId: string, method: string) => {
    const subject = encodeURIComponent(`Payment Received: ${eventTitle}`);
    const body = encodeURIComponent(
      `Payment Notification\n\n` +
      `Event: ${eventTitle}\n` +
      `Student: ${user?.name || 'Unknown'} (${user?.email || 'N/A'})\n` +
      `Amount: ₹${total.toFixed(2)}\n` +
      `Method: ${method}\n` +
      `Transaction ID: ${txId}\n` +
      `Date: ${new Date().toLocaleString()}\n\n` +
      `Please confirm this payment in the system.`
    );
    window.open(`mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  };

  const saveTransaction = (txId: string, method: string) => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift({
      id: txId,
      eventId,
      eventTitle,
      amount: total,
      paymentMethod: method,
      date: new Date().toISOString(),
      status: 'completed',
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
  };

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast.error('Please fill in all card details');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Enter a valid 16-digit card number');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      const txId = `TXN${Date.now()}`;
      setTransactionId(txId);
      setPaymentComplete(true);
      setIsProcessing(false);
      saveTransaction(txId, 'Credit/Debit Card');
      toast.success('Payment successful!');
      onPaymentSuccess?.(txId);
      notifyAdmin(txId, 'Credit/Debit Card');
    }, 2000);
  };

  const handleUpiConfirm = () => {
    if (!upiRef.trim()) {
      toast.error('Please enter your UPI transaction reference number');
      return;
    }
    const txId = `UPI${upiRef.trim().toUpperCase()}`;
    setTransactionId(txId);
    setPaymentComplete(true);
    saveTransaction(txId, 'UPI');
    toast.success('Payment submitted for confirmation!');
    onPaymentSuccess?.(txId);
    notifyAdmin(txId, 'UPI');
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setPaymentComplete(false);
      setCardNumber(''); setCardName(''); setExpiryDate(''); setCvv('');
      setUpiRef(''); setPaymentMethod('upi');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {!paymentComplete ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Complete Payment</DialogTitle>
              <DialogDescription>Register for {eventTitle}</DialogDescription>
            </DialogHeader>

            {/* Amount */}
            <div className="p-4 bg-muted rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Registration Fee</span>
                <span>₹{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Fee (2%)</span>
                <span>₹{(amount * 0.02).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Method Toggle */}
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-3">
              <div className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => setPaymentMethod('upi')}>
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="cursor-pointer">
                  <Wallet className="w-4 h-4 text-purple-600 mb-1" />
                  <span className="text-sm font-semibold block">UPI / QR</span>
                  <span className="text-xs text-muted-foreground">GPay, Paytm, PhonePe</span>
                </Label>
              </div>
              <div className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => setPaymentMethod('card')}>
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="cursor-pointer">
                  <CreditCard className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-sm font-semibold block">Card</span>
                  <span className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</span>
                </Label>
              </div>
            </RadioGroup>

            {/* UPI Flow */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-muted">
                  <p className="text-sm font-semibold">Scan QR to Pay ₹{total.toFixed(2)}</p>
                  <img src={qrUrl} alt="UPI QR Code" className="w-48 h-48 rounded-lg border bg-white p-2" />
                  <p className="text-xs text-muted-foreground">UPI ID: <span className="font-mono font-semibold">{UPI_ID}</span></p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>Google Pay</span>•<span>PhonePe</span>•<span>Paytm</span>•<span>Any UPI App</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upiRef">Enter UPI Transaction Reference No. after payment</Label>
                  <Input id="upiRef" placeholder="e.g. 123456789012" value={upiRef}
                    onChange={(e) => setUpiRef(e.target.value)} />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
                  <Button className="flex-1" onClick={handleUpiConfirm}>Confirm Payment</Button>
                </div>
              </div>
            )}

            {/* Card Flow */}
            {paymentMethod === 'card' && (
              <form onSubmit={handleCardPayment} className="space-y-3">
                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <Input placeholder="1234 5678 9012 3456" value={cardNumber}
                    onChange={(e) => { const v = e.target.value.replace(/\s/g, ''); if (v.length <= 16) setCardNumber(formatCardNumber(v)); }}
                    disabled={isProcessing} />
                </div>
                <div className="space-y-2">
                  <Label>Cardholder Name</Label>
                  <Input placeholder="Name on card" value={cardName}
                    onChange={(e) => setCardName(e.target.value)} disabled={isProcessing} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Expiry</Label>
                    <Input placeholder="MM/YY" value={expiryDate}
                      onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); if (v.length <= 4) setExpiryDate(formatExpiry(v)); }}
                      disabled={isProcessing} />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input placeholder="123" type="password" value={cvv}
                      onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); if (v.length <= 3) setCvv(v); }}
                      disabled={isProcessing} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={isProcessing}>Cancel</Button>
                  <Button type="submit" className="flex-1" disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : `Pay ₹${total.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">
                {paymentMethod === 'upi' ? 'Payment Submitted!' : 'Payment Successful!'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {paymentMethod === 'upi'
                  ? 'Your UPI payment is pending admin confirmation. An email has been sent to the admin.'
                  : `Your registration is confirmed for ${eventTitle}. Admin has been notified.`}
              </p>
              <div className="p-4 bg-muted rounded-lg space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-semibold text-xs">{transactionId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-semibold">{paymentMethod === 'upi' ? 'UPI' : 'Card'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Admin Notified</span>
                  <span className="font-semibold text-green-600">✓ Email Sent</span>
                </div>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
