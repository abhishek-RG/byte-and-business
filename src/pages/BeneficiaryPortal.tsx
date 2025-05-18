
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { Incident, fetchIncidents } from "@/services/mockDataService";
import Navbar from "@/components/layout/Navbar";
import IncidentCard from "@/components/cards/IncidentCard";
import IncidentForm from "@/components/forms/IncidentForm";
import { Loader2, PlusCircle } from "lucide-react";

const BeneficiaryPortal = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [myIncidents, setMyIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    if (!user || user.role !== "beneficiary") {
      navigate("/login");
      return;
    }
    
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const incidents = await fetchIncidents();
      
      // Filter incidents for this beneficiary
      if (user) {
        const filteredIncidents = incidents.filter(
          incident => incident.beneficiaryId === user.id
        );
        setMyIncidents(filteredIncidents);
      }
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = (incident: Incident) => {
    setMyIncidents(prev => [incident, ...prev]);
    setShowForm(false);
  };

  const getStatusCounts = () => {
    const counts = {
      submitted: 0,
      verified: 0,
      funded: 0,
      completed: 0
    };
    
    myIncidents.forEach(incident => {
      if (counts[incident.status as keyof typeof counts] !== undefined) {
        counts[incident.status as keyof typeof counts]++;
      }
    });
    
    return counts;
  };
  
  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen flex flex-col bg-relief-offWhite">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-relief-darkCharcoal">
              Beneficiary Portal
            </h1>
            
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2"
            >
              {showForm ? (
                "Cancel"
              ) : (
                <>
                  <PlusCircle size={18} className="mr-2" />
                  <span>New Incident</span>
                </>
              )}
            </Button>
          </div>
          
          {showForm ? (
            <div className="animate-scale-in mb-8">
              <IncidentForm onSuccess={handleFormSuccess} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{myIncidents.length}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Pending Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{statusCounts.submitted}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Funding Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{statusCounts.verified + statusCounts.funded}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{statusCounts.completed}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="animate-scale-in">
                <h2 className="text-xl font-bold mb-4 text-relief-darkCharcoal">Your Relief Cases</h2>
                
                <Tabs defaultValue="all">
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">All Cases</TabsTrigger>
                    <TabsTrigger value="submitted">Submitted</TabsTrigger>
                    <TabsTrigger value="verified">Verified</TabsTrigger>
                    <TabsTrigger value="funded">Funded</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-relief-darkGreen" />
                    </div>
                  ) : myIncidents.length > 0 ? (
                    <>
                      <TabsContent value="all">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {myIncidents.map(incident => (
                            <IncidentCard key={incident.id} incident={incident} className="animate-fade-in" />
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="submitted">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {myIncidents
                            .filter(incident => incident.status === 'submitted')
                            .map(incident => (
                              <IncidentCard key={incident.id} incident={incident} className="animate-fade-in" />
                            ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="verified">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {myIncidents
                            .filter(incident => incident.status === 'verified')
                            .map(incident => (
                              <IncidentCard key={incident.id} incident={incident} className="animate-fade-in" />
                            ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="funded">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {myIncidents
                            .filter(incident => incident.status === 'funded')
                            .map(incident => (
                              <IncidentCard key={incident.id} incident={incident} className="animate-fade-in" />
                            ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="completed">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {myIncidents
                            .filter(incident => incident.status === 'completed')
                            .map(incident => (
                              <IncidentCard key={incident.id} incident={incident} className="animate-fade-in" />
                            ))}
                        </div>
                      </TabsContent>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">You haven't reported any incidents yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setShowForm(true)}
                      >
                        Submit New Incident
                      </Button>
                    </div>
                  )}
                </Tabs>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryPortal;
