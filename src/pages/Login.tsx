
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser, UserRole } from "@/contexts/UserContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("donor");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      await login(email, password, selectedRole);
      toast.success(`Logged in successfully as ${selectedRole}`);
      
      // Redirect based on role
      switch(selectedRole) {
        case "donor":
          navigate("/donor");
          break;
        case "ngo":
          navigate("/ngo");
          break;
        case "beneficiary":
          navigate("/beneficiary");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleWeb3Auth = async (role: UserRole) => {
    try {
      // Simulate Web3Auth integration
      toast.info("Connecting to Web3Auth...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use a mock email for Web3Auth
      const mockEmail = `${role}-${Math.random().toString(36).substring(2, 8)}@example.com`;
      await login(mockEmail, "web3auth-password", role);
      
      toast.success(`Logged in successfully as ${role}`);
      
      // Redirect based on role
      if (role === "donor") {
        navigate("/donor");
      } else if (role === "ngo") {
        navigate("/ngo");
      }
    } catch (error) {
      console.error("Web3Auth error:", error);
      toast.error("Web3Auth login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-relief-offWhite">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto animate-scale-in">
          <CardHeader>
            <CardTitle className="text-relief-darkCharcoal text-center text-2xl">Welcome to ReliefChain</CardTitle>
            <CardDescription className="text-center">
              Login to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="donor" onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="donor">Donor</TabsTrigger>
                <TabsTrigger value="ngo">NGO</TabsTrigger>
                <TabsTrigger value="beneficiary">Beneficiary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="donor">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    As a donor, you can browse verified disaster incidents and make donations directly to those in need.
                  </p>
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleWeb3Auth("donor")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Connecting..." : "Continue with Web3Auth"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="ngo">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    As an NGO partner, you can verify incidents and release funds to beneficiaries.
                  </p>
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleWeb3Auth("ngo")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Connecting..." : "Continue with Web3Auth"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="beneficiary">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-xs text-gray-500 text-center">
              By logging in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
