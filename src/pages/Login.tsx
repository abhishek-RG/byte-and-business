
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser, UserRole } from "@/contexts/UserContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define validation schema for auth forms
const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading, user, profile } = useUser();
  const [selectedRole, setSelectedRole] = useState<UserRole>("beneficiary");
  const [isSignUp, setIsSignUp] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && profile) {
      switch(profile.role) {
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
    }
  }, [user, profile, navigate]);

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Signup form
  const signupForm = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLogin = async (values: z.infer<typeof authSchema>) => {
    try {
      await login(values.email, values.password, selectedRole);
      console.log("Login successful");
      // Redirection will be handled by the useEffect hook
    } catch (error: any) {
      console.error("Login error:", error);
      // Error is already handled in UserContext
    }
  };

  const handleSignup = async (values: z.infer<typeof authSchema>) => {
    try {
      await signup(values.email, values.password, selectedRole);
      setIsSignUp(false); // Switch back to login view after successful signup
      toast.success("Account created successfully! Please check your email to verify your account before logging in.");
    } catch (error: any) {
      console.error("Signup error:", error);
      // Error is already handled in UserContext
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
      
      // Redirect will be handled by useEffect
    } catch (error) {
      console.error("Web3Auth error:", error);
      toast.error("Web3Auth login failed. Please try again.");
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    loginForm.reset();
    signupForm.reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-relief-offWhite">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto animate-scale-in">
          <CardHeader>
            <CardTitle className="text-relief-darkCharcoal text-center text-2xl">
              {isSignUp ? "Create Account" : "Welcome to ReliefChain"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp ? "Sign up to join ReliefChain" : "Login to access your dashboard"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
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
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? "Connecting..." : "Continue with Web3Auth"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="ngo">
                {isSignUp ? (
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit((values) => handleSignup(values))} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLoading ? "Creating Account..." : "Create NGO Account"}
                      </Button>

                      <div className="text-center mt-4">
                        <Button
                          variant="link"
                          type="button"
                          onClick={toggleAuthMode}
                          className="text-sm text-blue-600"
                        >
                          Already have an account? Sign In
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLoading ? "Signing In..." : "Sign In as NGO"}
                      </Button>

                      <div className="text-center mt-4">
                        <Button
                          variant="link"
                          type="button"
                          onClick={toggleAuthMode}
                          className="text-sm text-blue-600"
                        >
                          Don't have an account? Sign Up
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </TabsContent>
              
              <TabsContent value="beneficiary">
                {isSignUp ? (
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLoading ? "Creating Account..." : "Create Beneficiary Account"}
                      </Button>

                      <div className="text-center mt-4">
                        <Button
                          variant="link"
                          type="button"
                          onClick={toggleAuthMode}
                          className="text-sm text-blue-600"
                        >
                          Already have an account? Sign In
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLoading ? "Signing In..." : "Sign In as Beneficiary"}
                      </Button>

                      <div className="text-center mt-4">
                        <Button
                          variant="link"
                          type="button"
                          onClick={toggleAuthMode}
                          className="text-sm text-blue-600"
                        >
                          Don't have an account? Sign Up
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
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
