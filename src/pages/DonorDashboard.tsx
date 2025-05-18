import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const DonorDashboard = () => {
  const [incidents, setIncidents] = useState([]);

  const { data: incidentsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('*');

      if (error) {
        console.error("Error fetching incidents:", error);
        throw new Error(error.message);
      }
      return data;
    },
  });

  useEffect(() => {
    if (incidentsData) {
      setIncidents(incidentsData);
    }
  }, [incidentsData]);

  if (isLoading) return <div>Loading incidents...</div>;
  if (isError) return <div>Error fetching incidents. Please try again.</div>;

  // Fix the problematic button click handler that was causing the error
  const handleDonate = (incident: any) => {
    // Simulate opening Transak widget and handling donation
    toast.success(`Processing donation for ${incident.title}`);
    
    // Instead of using .click() on the element, we'll use a different approach
    // Either manipulate the DOM directly if needed:
    const donateButton = document.getElementById(`donate-button-${incident.id}`);
    if (donateButton instanceof HTMLElement) {
      donateButton.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    }
    
    // Or just handle the logic directly:
    setTimeout(() => {
      toast.success(`Donation of $${Math.floor(Math.random() * 100) + 50} processed!`);
      toast.info(`Transaction hash: 0x${Math.random().toString(36).substring(2, 15)}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Donor Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link to="/incidents/create">
              <Button className="ml-3">
                <PlusCircle className="mr-2 h-4 w-4" />
                Report Incident
              </Button>
            </Link>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {incidents.map((incident: any) => (
            <li key={incident.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <Card>
                <CardHeader>
                  <CardTitle>{incident.title}</CardTitle>
                  <CardDescription>{incident.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{incident.description}</p>
                  <Button onClick={() => handleDonate(incident)}>
                    Donate
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DonorDashboard;
