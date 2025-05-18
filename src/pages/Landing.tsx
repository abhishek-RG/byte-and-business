
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Users, Heart, Home } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-relief-offWhite">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-relief-darkCharcoal mb-4">
              Blockchain-Powered Disaster Relief Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connecting donors directly with disaster victims through transparent, 
              blockchain-verified relief efforts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="relief-card animate-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-relief-softBlue flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">For Beneficiaries</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Submit disaster incidents and receive direct assistance through verified channels.
                </p>
                <Link to="/login" className="mt-auto">
                  <Button className="w-full">Request Help</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="relief-card animate-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-relief-green flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">For Donors</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Make direct donations to verified disaster victims with complete transparency.
                </p>
                <Link to="/login" className="mt-auto">
                  <Button className="w-full">Donate Now</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="relief-card animate-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">For NGOs</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Verify incidents and ensure aid reaches legitimate disaster victims.
                </p>
                <Link to="/login" className="mt-auto">
                  <Button className="w-full">Partner With Us</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-relief-darkCharcoal">How It Works</h2>
            <ol className="space-y-4">
              <li className="flex">
                <span className="bg-relief-softBlue text-blue-600 h-6 w-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">1</span>
                <div>
                  <p className="font-medium">Beneficiaries Report Incidents</p>
                  <p className="text-gray-600 text-sm">Disaster victims submit details and evidence of their situation.</p>
                </div>
              </li>
              <li className="flex">
                <span className="bg-relief-softBlue text-blue-600 h-6 w-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">2</span>
                <div>
                  <p className="font-medium">NGOs Verify Incidents</p>
                  <p className="text-gray-600 text-sm">Trusted NGO partners validate the authenticity of each incident.</p>
                </div>
              </li>
              <li className="flex">
                <span className="bg-relief-softBlue text-blue-600 h-6 w-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">3</span>
                <div>
                  <p className="font-medium">Donors Contribute Directly</p>
                  <p className="text-gray-600 text-sm">Donors can view verified cases and make direct blockchain payments.</p>
                </div>
              </li>
              <li className="flex">
                <span className="bg-relief-softBlue text-blue-600 h-6 w-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">4</span>
                <div>
                  <p className="font-medium">Funds Released to Beneficiaries</p>
                  <p className="text-gray-600 text-sm">NGOs release funds to beneficiaries once conditions are met.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
      
      <footer className="bg-relief-darkCharcoal text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-medium mb-2">ReliefChain - Blockchain Disaster Relief Platform</p>
          <p className="text-sm text-gray-300">Powered by Polygon &amp; Supabase</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
