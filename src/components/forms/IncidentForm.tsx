
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { createIncident, Incident } from "@/services/mockDataService";
import { Upload } from "lucide-react";

interface IncidentFormProps {
  onSuccess?: (incident: Incident) => void;
}

const IncidentForm = ({ onSuccess }: IncidentFormProps) => {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    location: "",
    cause: "",
    description: "",
    severity: "",
    amountNeeded: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, severity: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setUploading(true);
      setUploadProgress(0);
      
      // Create a URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!formData.location || !formData.cause || !formData.description || 
          !formData.severity || !imagePreview || !formData.amountNeeded) {
        toast.error("Please fill out all required fields");
        return;
      }
      
      // Prepare incident data
      const newIncident: Omit<Incident, 'id'> = {
        beneficiaryId: user.id,
        beneficiaryName: user.name,
        location: formData.location,
        timestamp: new Date().toISOString(),
        cause: formData.cause,
        description: formData.description,
        severity: formData.severity as 'low' | 'medium' | 'high' | 'critical',
        imageUrl: imagePreview,
        status: 'submitted',
        amountNeeded: parseFloat(formData.amountNeeded)
      };
      
      // Submit incident
      const result = await createIncident(newIncident);
      
      toast.success("Incident submitted successfully!");
      
      // Reset form
      setFormData({
        location: "",
        cause: "",
        description: "",
        severity: "",
        amountNeeded: ""
      });
      setImagePreview(null);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error("Error submitting incident:", error);
      toast.error("Failed to submit incident. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-scale-in">
      <CardHeader>
        <CardTitle className="text-relief-darkCharcoal">Report Disaster Incident</CardTitle>
        <CardDescription>
          Provide details about the disaster incident to request assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              name="location"
              placeholder="City, Country" 
              value={formData.location}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cause">Cause of Disaster</Label>
            <Input 
              id="cause" 
              name="cause"
              placeholder="e.g. Earthquake, Flood, etc." 
              value={formData.cause}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description"
              placeholder="Describe the situation and your needs..." 
              value={formData.description}
              onChange={handleInputChange}
              required
              className="input-field min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <Select 
              value={formData.severity} 
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amountNeeded">Amount Needed (USD)</Label>
            <Input 
              id="amountNeeded" 
              name="amountNeeded"
              type="number"
              placeholder="e.g. 5000" 
              value={formData.amountNeeded}
              onChange={handleInputChange}
              required
              min="1"
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
              {imagePreview ? (
                <div className="space-y-2 w-full">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => setImagePreview(null)}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <Input 
                        id="file-upload" 
                        type="file" 
                        className="sr-only" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
            
            {uploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1" />
              </div>
            )}
          </div>
          
          <CardFooter className="px-0 pt-4">
            <Button 
              type="submit" 
              className="w-full primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Incident Report"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncidentForm;
