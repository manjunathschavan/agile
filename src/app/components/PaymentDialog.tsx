import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CreditCard, Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  amount: number;
  eventId: string;
  onPaymentSuccess?: (transactionId: string) => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  eventTitle,
  amount,
  eventId,
  onPaymentSuccess,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(formatExpiryDate(value));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error('Please fill in all card details');
        return;
      }

      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return;
      }

      if (cvv.length !== 3) {
        toast.error('Please enter a valid 3-digit CVV');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const txId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setTransactionId(txId);
      setPaymentComplete(true);
      setIsProcessing(false);

      toast.success('Payment processed successfully!');

      if (onPaymentSuccess) {
        onPaymentSuccess(txId);
      }

      // Store transaction in localStorage
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.unshift({
        id: txId,
        eventId,
        eventTitle,
        amount: amount * 1.02, // Include processing fee
        paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI / Digital Wallet',
        date: new Date().toISOString(),
        status: 'completed',
      });
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }, 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setPaymentComplete(false);
      setCardNumber('');
      setCardName('');
      setExpiryDate('');
      setCvv('');
      setPaymentMethod('card');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!paymentComplete ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">Payment</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Complete your registration for {eventTitle}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handlePayment} className="space-y-4 sm:space-y-6">
              {/* Amount Display */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-muted-foreground">Registration Fee</span>
                  <span className="text-xl sm:text-2xl font-bold">₹{amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-muted-foreground">Processing Fee (2%)</span>
                  <span className="font-semibold">₹{(amount * 0.02).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t">
                  <span className="text-sm sm:text-base font-semibold">Total Amount</span>
                  <span className="text-xl sm:text-2xl font-bold">₹{(amount * 1.02).toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label className="text-sm sm:text-base">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <span className="text-sm sm:text-base font-semibold block">Credit / Debit Card</span>
                        <span className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="w-5 h-5 text-purple-600" />
                      <div className="flex-1">
                        <span className="text-sm sm:text-base font-semibold block">Digital Wallet / UPI</span>
                        <span className="text-xs text-muted-foreground">PhonePe, Google Pay, Paytm, UPI</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-sm">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="text-sm sm:text-base"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-sm">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="Cardholder Name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="text-sm sm:text-base"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-sm">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        className="text-sm sm:text-base"
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-sm">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cvv}
                        onChange={handleCvvChange}
                        className="text-sm sm:text-base"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Payment */}
              {paymentMethod === 'wallet' && (
                <div className="p-4 border rounded-lg text-center space-y-3 bg-muted">
                  <Wallet className="w-12 h-12 mx-auto text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold mb-1">UPI / Digital Wallet Payment</p>
                    <p className="text-sm text-muted-foreground">
                      You will be redirected to complete the payment of ₹{(amount * 1.02).toFixed(2)} through your preferred UPI app or digital wallet
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-sm sm:text-base"
                  onClick={handleClose}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-sm sm:text-base"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${(amount * 1.02).toFixed(2)}`
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Your registration has been confirmed for {eventTitle}
              </p>
              <div className="p-3 sm:p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-semibold">{transactionId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold">₹{(amount * 1.02).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-semibold capitalize">{paymentMethod === 'card' ? 'Card' : 'UPI / Wallet'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-green-600">Completed</span>
                </div>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full text-sm sm:text-base">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
