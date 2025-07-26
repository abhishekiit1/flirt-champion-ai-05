import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Key, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ApiKeySettingsProps {
  onApiKeySet?: (apiKey: string) => void;
}

export default function ApiKeySettings({ onApiKeySet }: ApiKeySettingsProps) {
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage on component mount
    const saved = localStorage.getItem('flirt-champion-api-key');
    if (saved) {
      setSavedApiKey(saved);
      setApiKey(saved);
    }
  }, []);

  const testConnection = async (keyToTest: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${keyToTest}`, {
        headers: {
          'X-goog-api-key': keyToTest,
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive"
      });
      return;
    }

    setIsTestingConnection(true);
    
    const isValid = await testConnection(apiKey.trim());
    
    if (isValid) {
      localStorage.setItem('flirt-champion-api-key', apiKey.trim());
      setSavedApiKey(apiKey.trim());
      setIsDialogOpen(false);
      
      toast({
        title: "Success!",
        description: "API key saved and verified successfully",
      });
      
      if (onApiKeySet) {
        onApiKeySet(apiKey.trim());
      }
    } else {
      toast({
        title: "Invalid API Key",
        description: "The API key couldn't be verified. Please check and try again.",
        variant: "destructive"
      });
    }
    
    setIsTestingConnection(false);
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('flirt-champion-api-key');
    setSavedApiKey("");
    setApiKey("");
    setIsDialogOpen(false);
    
    toast({
      title: "API Key Removed",
      description: "You'll need to enter your API key for each game session",
    });
  };

  const getStoredApiKey = (): string | null => {
    return localStorage.getItem('flirt-champion-api-key');
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>API Settings</span>
          {savedApiKey && <Check className="w-3 h-3 text-success" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>API Key Settings</span>
          </DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Gemini API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <Input
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Get your free API key from{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            {savedApiKey && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-success">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">API Key Saved</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Key ends with: ...{savedApiKey.slice(-6)}
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                onClick={handleSaveApiKey}
                disabled={isTestingConnection || !apiKey.trim()}
                className="flex-1"
              >
                {isTestingConnection ? "Testing..." : "Save & Verify"}
              </Button>
              
              {savedApiKey && (
                <Button 
                  variant="destructive"
                  size="icon"
                  onClick={handleRemoveApiKey}
                  title="Remove saved API key"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

// Export utility function to get stored API key
export const getStoredApiKey = (): string | null => {
  return localStorage.getItem('flirt-champion-api-key');
};