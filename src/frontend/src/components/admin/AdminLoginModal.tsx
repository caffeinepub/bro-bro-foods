import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { setAdminToken, validateAdminToken } from '@/lib/adminAccess';

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminLoginModal({ open, onOpenChange }: AdminLoginModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 4 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pin.trim()) {
      setError('Please enter your admin PIN');
      return;
    }

    if (pin.length !== 4) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    if (validateAdminToken(pin.trim())) {
      setAdminToken(pin.trim());
      setPin('');
      onOpenChange(false);
    } else {
      setError('Invalid admin PIN');
    }
  };

  const handleClose = () => {
    setPin('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
          <DialogDescription>
            Enter your 4-digit admin PIN to access the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pin">Admin PIN</Label>
              <Input
                id="pin"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={handlePinChange}
                maxLength={4}
                className={error ? 'border-destructive' : ''}
                autoComplete="off"
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
