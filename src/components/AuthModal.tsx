import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, User, Mail, Lock, Building, Camera, UserPlus, LogIn } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('official@glacier.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPosition, setSignupPosition] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('');
  const [signupPhoto, setSignupPhoto] = useState<string | null>(null);

  // Reset to login tab when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab('login');
      setLoginEmail('official@glacier.com');
      setLoginPassword('password123');
    }
  }, [open]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock authentication - simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check mock credentials
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // First check if it's the default mock user
    let user = null;
    if (loginEmail === 'official@glacier.com' && loginPassword === 'password123') {
      user = {
        id: 1,
        name: 'Admin Official',
        email: 'official@glacier.com',
        position: 'Administrator',
        department: 'GLOF Management',
        photo: null
      };
    } else {
      // Check registered users
      user = users.find((u: any) => u.email === loginEmail && u.password === loginPassword);
    }
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      onOpenChange(false);
    } else {
      alert('Invalid credentials. Use: official@glacier.com / password123');
    }
    
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock authentication - simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find((u: any) => u.email === signupEmail)) {
      alert('Email already registered!');
      setLoading(false);
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name: signupName,
      email: signupEmail,
      position: signupPosition,
      department: signupDepartment,
      photo: signupPhoto,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    onOpenChange(false);
    setLoading(false);
    
    // Reset form
    setSignupName('');
    setSignupEmail('');
    setSignupPosition('');
    setSignupDepartment('');
    setSignupPhoto(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignupPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 bg-[#111827] border-gray-700 overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none z-10"
        >
          <X className="h-4 w-4 text-gray-400" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-center border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-1">
            GLOF Intelligence
          </h2>
          <p className="text-slate-400 text-sm">
            Sign in or create an account
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-slate-800 p-0 h-12 rounded-none border-b border-gray-700">
            <TabsTrigger 
              value="login" 
              className="rounded-none h-12 data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-blue-500 transition-all"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              className="rounded-none h-12 data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-blue-500 transition-all"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="p-6 mt-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="official@glacier.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Mock Credentials:</p>
                <p className="text-xs text-slate-300">Email: official@glacier.com</p>
                <p className="text-xs text-slate-300">Password: password123</p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="p-6 mt-0">
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Profile Photo - Moved to Top */}
              <div className="space-y-2">
                <Label className="text-slate-300">Profile Photo</Label>
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="relative">
                    {signupPhoto ? (
                      <img
                        src={signupPhoto}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-3 border-blue-500 shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center border-3 border-slate-600 shadow-lg">
                        <Camera className="h-10 w-10 text-slate-400" />
                      </div>
                    )}
                    <label
                      htmlFor="signup-photo"
                      className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
                    >
                      <Camera className="h-4 w-4 text-white" />
                    </label>
                  </div>
                  <Input
                    id="signup-photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-slate-400 text-center">
                    {signupPhoto ? 'Photo uploaded successfully!' : 'Click the camera icon to upload a photo'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-slate-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="official@glacier.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-position" className="text-slate-300">Position</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="signup-position"
                      type="text"
                      placeholder="e.g. Analyst"
                      value={signupPosition}
                      onChange={(e) => setSignupPosition(e.target.value)}
                      className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-department" className="text-slate-300">Department</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="signup-department"
                      type="text"
                      placeholder="e.g. Research"
                      value={signupDepartment}
                      onChange={(e) => setSignupDepartment(e.target.value)}
                      className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {loading ? 'Creating Account...' : 'Register as Official'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

