
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { Incident, fetchIncidents, approveIncident, releaseFunds } from "@/services/mockDataService";
import Navbar from "@/components/layout/Navbar";
import IncidentCard from "@/components/cards/IncidentCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCheck, Loader2 } from "lucide-react";

const NGODashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [pendingIncidents, setPendingIncidents] = useState<Incident[]>([]);
  const [verifiedIncidents, setVerifiedIncidents] = useState<Incident[]>([]);
  const [fundedIncidents, setFundedIncidents] = useState<Incident[]>([]);
  const [completedIncidents, setCompletedIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [actionType, setActionType] = useState<"approve" | "release" | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (!user || user.role !== "ngo") {
      navigate("/login");
      return;
    }
    
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const incidents = await fetchIncidents();
      
      setPendingIncidents(incidents.filter(i => i.status === 'submitted'));
      setVerifiedIncidents(incidents.filter(i => i.status === 'verified'));
      setFundedIncidents(incidents.filter(i => i.status === 'funded'));
      setCompletedIncidents(incidents.filter(i => i.status === 'completed'));
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (incident: Incident) => {
    setSelectedIncident(incident);
    setActionType("approve");
    setIsDialogOpen(true);
  };

  const handleRelease = (incident: Incident) => {
    setSelectedIncident(incident);
    setActionType("release");
    setIsDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedIncident || !user || !actionType) return;
    
    try {
      setIsProcessing(true);
      
      if (actionType === "approve") {
        await approveIncident(selectedIncident.id, user.id, user.name);
        toast.success("Incident verified successfully!");
      } else {
        await releaseFunds(selectedIncident.id);
        toast.success("Funds released successfully!");
      }
      
      setIsDialogOpen(false);
      setSelectedIncident(null);
      setActionType(null);
      
      await fetchData();
    } catch (error) {
      console.error(`Error ${actionType === "approve" ? "approving" : "releasing funds for"} incident:`, error);
      toast.error(`Failed to ${actionType === "approve" ? "verify incident" : "release funds"}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-relief-offWhite">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-relief-darkCharcoal mb-6 animate-fade-in">
            NGO Dashboard
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pending Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{pendingIncidents.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Verified Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{verifiedIncidents.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Ready for Release</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{fundedIncidents.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{completedIncidents.length}</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="pending" className="animate-scale-in">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">Pending Verification</TabsTrigger>
              <TabsTrigger value="verified">Verified Cases</TabsTrigger>
              <TabsTrigger value="funded">Ready for Release</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-relief-darkGreen" />
                </div>
              ) : pendingIncidents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingIncidents.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      actionButton={{
                        label: "Verify Case",
                        onClick: handleApprove,
                        variant: "default"
                      }}
                      className="animate-fade-in"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No pending incidents requiring verification.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={fetchData}
                  >
                    Refresh
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="verified">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-relief-darkGreen" />
                </div>
              ) : verifiedIncidents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {verifiedIncidents.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      className="animate-fade-in"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No verified cases waiting for funding.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="funded">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-relief-darkGreen" />
                </div>
              ) : fundedIncidents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fundedIncidents.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      actionButton={{
                        label: "Release Funds",
                        onClick: handleRelease,
                        variant: "default"
                      }}
                      className="animate-fade-in"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No funded cases ready for release.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={fetchData}
                  >
                    Refresh
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-relief-darkGreen" />
                </div>
              ) : completedIncidents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedIncidents.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      className="animate-fade-in"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No completed relief cases yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Verify Relief Case" : "Release Funds"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "Verify this relief case to make it visible to donors. This action cannot be undone."
                : "Release funds to the beneficiary. This will mark the case as completed."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedIncident && (
            <div className="py-4">
              <h3 className="font-medium">{selectedIncident.cause}</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedIncident.location}</p>
              
              {actionType === "release" && selectedIncident.amountFunded && (
                <p className="text-sm mt-2">
                  Amount to release: <span className="font-bold">${selectedIncident.amountFunded.toLocaleString()}</span>
                </p>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmAction}
              disabled={isProcessing}
              className="flex items-center space-x-2"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCheck className="h-4 w-4 mr-2" />
              )}
              <span>
                {actionType === "approve"
                  ? isProcessing ? "Verifying..." : "Verify Case"
                  : isProcessing ? "Releasing..." : "Release Funds"
                }
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NGODashboard;
