
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Incident, makeDonation } from "@/services/mockDataService";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DonationFormProps {
  incident: Incident;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DonationForm = ({ incident, isOpen, onClose, onSuccess }: DonationFormProps) => {
  const { user } = useUser();
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) return;
    
    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Simulate connecting to web3 wallet
      toast.info("Connecting to wallet...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate transak widget
      toast.info("Processing payment...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate blockchain transaction
      toast.info("Executing blockchain transaction...");
      
      // Make the donation
      await makeDonation(user.id, user.name, incident.id, donationAmount);
      
      toast.success("Donation successful! Thank you for your support.");
      
      setAmount("");
      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error processing donation:", error);
      toast.error("Failed to process donation. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestedAmounts = [10, 50, 100, 500];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Donate to {incident.cause}</DialogTitle>
          <DialogDescription>
            Your donation will go directly to helping those affected by this disaster.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="donationAmount" className="text-left">
                Donation Amount (USD)
              </Label>
              <Input
                id="donationAmount"
                placeholder="Enter amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min="1"
                required
                className="input-field"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestedAmounts.map((amt) => (
                <Button
                  key={amt}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(amt.toString())}
                  className="flex-1"
                >
                  ${amt}
                </Button>
              ))}
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md mt-2">
              <p className="text-sm font-medium mb-1">Donation Summary</p>
              <div className="flex justify-between text-sm">
                <span>Donation Amount:</span>
                <span>${amount ? parseFloat(amount).toFixed(2) : "0.00"}</span>
              </div>
              <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t border-gray-200">
                <span>Total Amount:</span>
                <span>${amount ? parseFloat(amount).toFixed(2) : "0.00"}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" className="primary-button" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Donate Now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationForm;
