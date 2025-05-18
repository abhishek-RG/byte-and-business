
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Incident } from "@/services/mockDataService";
import StatusBadge from "../ui/StatusBadge";
import { MapPin, Calendar, AlertCircle } from "lucide-react";

interface IncidentCardProps {
  incident: Incident;
  actionButton?: {
    label: string;
    onClick: (incident: Incident) => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  };
  className?: string;
}

const IncidentCard = ({ incident, actionButton, className }: IncidentCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${className || ''}`}>
      <div className="h-40 overflow-hidden">
        <img 
          src={incident.imageUrl} 
          alt={incident.cause} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-relief-darkCharcoal">{incident.cause}</CardTitle>
          <StatusBadge status={incident.status} />
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin size={14} className="mr-1" />
          <span>{incident.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={14} className="mr-1" />
          <span>{formatDate(incident.timestamp)}</span>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-gray-600 line-clamp-2">
          {incident.description}
        </p>
        <div className="flex items-center mt-2">
          <AlertCircle size={14} className={`mr-1 ${getSeverityColor(incident.severity)}`} />
          <span className={`text-sm font-medium ${getSeverityColor(incident.severity)}`}>
            {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)} Severity
          </span>
        </div>
        {incident.amountNeeded && (
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Funding Progress</span>
              <span className="font-medium">
                ${incident.amountFunded || 0} / ${incident.amountNeeded}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-relief-darkGreen h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ 
                  width: `${Math.min(100, ((incident.amountFunded || 0) / incident.amountNeeded) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
      {actionButton && (
        <CardFooter className="pt-2">
          <Button 
            variant={actionButton.variant || "default"} 
            className="w-full"
            onClick={() => actionButton.onClick(incident)}
          >
            {actionButton.label}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default IncidentCard;
