
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Donation, fetchIncidentById } from "@/services/mockDataService";
import StatusBadge from "../ui/StatusBadge";
import { Calendar, Receipt } from "lucide-react";
import { useState, useEffect } from "react";

interface DonationCardProps {
  donation: Donation;
  className?: string;
}

const DonationCard = ({ donation, className }: DonationCardProps) => {
  const [incidentCause, setIncidentCause] = useState("");

  useEffect(() => {
    const getIncidentDetails = async () => {
      try {
        const incident = await fetchIncidentById(donation.incidentId);
        if (incident) {
          setIncidentCause(incident.cause);
        }
      } catch (error) {
        console.error("Failed to fetch incident details:", error);
      }
    };

    getIncidentDetails();
  }, [donation.incidentId]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`;
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${className || ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-relief-darkCharcoal">
            ${donation.amount.toLocaleString()} Donation
          </CardTitle>
          <StatusBadge status={donation.status} />
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={14} className="mr-1" />
          <span>{formatDate(donation.timestamp)}</span>
        </div>
      </CardHeader>
      <CardContent className="py-2 space-y-2">
        <div>
          <p className="text-xs text-gray-500">For</p>
          <p className="font-medium">{incidentCause || "Loading..."}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Transaction Hash</p>
          <p className="font-mono text-sm">{truncateHash(donation.transactionHash)}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs flex items-center justify-center"
          onClick={() => {
            navigator.clipboard.writeText(donation.transactionHash);
            alert("Transaction hash copied to clipboard!");
          }}
        >
          <Receipt size={14} className="mr-1" />
          Copy Receipt
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DonationCard;
