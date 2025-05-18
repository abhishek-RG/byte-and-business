
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { Incident, Donation, fetchIncidents, fetchDonationsByDonor } from "@/services/mockDataService";
import Navbar from "@/components/layout/Navbar";
import IncidentCard from "@/components/cards/IncidentCard";
import DonationCard from "@/components/cards/DonationCard";
import DonationForm from "@/components/forms/DonationForm";
import { Loader2 } from "lucide-react";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user || user.role !== "donor") {
      navigate("/login");
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [incidentsData, donationsData] = await Promise.all([
          fetchIncidents(),
          fetchDonationsByDonor(user.id)
        ]);
        
        // Filter only verified incidents for donors
        setIncidents(incidentsData.filter(incident => incident.status === 'verified'));
        setDonations(donationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, navigate]);

  const handleDonate = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsDonationModalOpen(true);
  };

  const refreshData = async () => {
    try {
      const [incidentsData, donationsData] = await Promise.all([
        fetchIncidents(),
        fetchDonationsByDonor(user?.id || "")
      ]);
      
      setIncidents(incidentsData.filter(incident => incident.status === 'verified'));
      setDonations(donationsData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const formatTotalDonations = () => {
    const total = donations.reduce((sum, donation) => sum + donation.amount, 0);
    return total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-relief-offWhite">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-relief-darkCharcoal mb-6 animate-fade-in">
            Donor Dashboard
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatTotalDonations()}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Relief Projects Supported</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{donations.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Wallet Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-mono truncate">{user?.walletAddress || "Not connected"}</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="cases" className="animate-scale-in">
            <TabsList className="mb-6">
              <TabsTrigger value="cases">Verified Relief Cases</TabsTrigger>
              <TabsTrigger value="donations">My Donations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cases">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-relief-darkGreen" />
                </div>
              ) : incidents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {incidents.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      actionButton={{
                        label: "Donate",
                        onClick: handleDonate,
                        variant: "default"
                      }}
                      className="animate-fade-in"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No verified relief cases available currently.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={refreshData}
                  >
                    Refresh
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="donations">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-relief-darkGreen" />
                </div>
              ) : donations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {donations.map((donation) => (
                    <DonationCard
                      key={donation.id}
                      donation={donation}
                      className="animate-fade-in"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">You haven't made any donations yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.querySelector('[data-value="cases"]')?.click()}
                  >
                    Explore Relief Cases
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {selectedIncident && (
        <DonationForm
          incident={selectedIncident}
          isOpen={isDonationModalOpen}
          onClose={() => {
            setIsDonationModalOpen(false);
            setSelectedIncident(null);
          }}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
};

export default DonorDashboard;
