import { useState } from 'react';
import { Loader2, Plus, Minus } from 'lucide-react';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { meetsMinimumOrder, getMinimumOrderMessage, getMinimumOrderError } from '../lib/orderRules';
import type { Order } from '../backend';

interface OrderFormProps {
  onSuccess: (order: Order) => void;
}

type PlateType = 'half' | 'full' | null;

function OrderForm({ onSuccess }: OrderFormProps) {
  const [selectedPlate, setSelectedPlate] = useState<PlateType>(null);
  const [quantity, setQuantity] = useState(1);
  const { createOrder, isLoading, error, data, reset } = useCreateOrder();

  const plateOptions = {
    half: { id: 1n, name: 'Half Plate', price: 50n, pieces: 12 },
    full: { id: 2n, name: 'Full Plate', price: 80n, pieces: 24 },
  };

  const handlePlateSelect = (plate: PlateType) => {
    setSelectedPlate(plate);
    // Reset any previous error when user changes selection
    if (error) {
      reset();
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    if (error) {
      reset();
    }
  };

  const handleSubmit = () => {
    if (!selectedPlate) return;
    if (!meetsMinimumOrder(quantity)) return;

    const option = plateOptions[selectedPlate];
    createOrder(
      {
        plateTypeId: option.id,
        plateTypeName: option.name,
        price: option.price,
        quantity: BigInt(quantity),
      },
      {
        onSuccess: (order) => {
          onSuccess(order);
          // Reset form after successful order
          setSelectedPlate(null);
          setQuantity(1);
        },
      }
    );
  };

  const selectedOption = selectedPlate ? plateOptions[selectedPlate] : null;
  const unitPrice = selectedOption ? Number(selectedOption.price) : 0;
  const totalAmount = unitPrice * quantity;
  const canSubmit = selectedPlate && meetsMinimumOrder(quantity) && !isLoading;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-border">
        <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
          Select Your Plate
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {getMinimumOrderMessage()}
        </p>

        {/* Plate Selection */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Half Plate */}
          <button
            onClick={() => handlePlateSelect('half')}
            disabled={isLoading}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedPlate === 'half'
                ? 'border-primary bg-primary/10 shadow-md'
                : 'border-border hover:border-primary/50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="text-center">
              <p className="text-xl font-bold text-foreground mb-2">Half Plate</p>
              <p className="text-3xl font-black text-primary mb-2">₹50</p>
              <p className="text-sm text-muted-foreground">12 Pieces</p>
            </div>
          </button>

          {/* Full Plate */}
          <button
            onClick={() => handlePlateSelect('full')}
            disabled={isLoading}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedPlate === 'full'
                ? 'border-primary bg-primary/10 shadow-md'
                : 'border-border hover:border-primary/50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="text-center">
              <p className="text-xl font-bold text-foreground mb-2">Full Plate</p>
              <p className="text-3xl font-black text-primary mb-2">₹80</p>
              <p className="text-sm text-muted-foreground">24 Pieces</p>
            </div>
          </button>
        </div>

        {/* Quantity Selector */}
        {selectedOption && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Quantity (Plates)
            </label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isLoading}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  quantity <= 1 || isLoading
                    ? 'border-border text-muted-foreground cursor-not-allowed'
                    : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                <Minus size={20} />
              </button>
              <div className="w-20 text-center">
                <span className="text-3xl font-bold text-foreground">{quantity}</span>
              </div>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={isLoading}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  isLoading
                    ? 'border-border text-muted-foreground cursor-not-allowed'
                    : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        {selectedOption && (
          <div className="bg-accent/30 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/80">Unit Price:</span>
              <span className="font-semibold text-foreground">₹{unitPrice}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/80">Quantity:</span>
              <span className="font-semibold text-foreground">{quantity} plate{quantity > 1 ? 's' : ''}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-foreground">Total Amount:</span>
                <span className="text-2xl font-black text-primary">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Minimum Order Validation */}
        {selectedOption && !meetsMinimumOrder(quantity) && (
          <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-6">
            <p className="text-warning font-medium text-center text-sm">
              {getMinimumOrderError(quantity)}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6">
            <p className="text-destructive font-medium text-center">
              {error.message || 'Failed to place order. Please try again.'}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
            !canSubmit
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              Placing Order...
            </span>
          ) : (
            'Place Order'
          )}
        </button>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Fresh momos prepared after order confirmation
        </p>
      </div>
    </div>
  );
}

export default OrderForm;
