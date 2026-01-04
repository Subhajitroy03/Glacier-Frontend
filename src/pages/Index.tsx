import { useState, useEffect } from 'react';
import TopNavbar from '@/components/TopNavbar';
import FilterSidebar from '@/components/FilterSidebar';
import MapView from '@/components/MapView';

import LakeDetailPanel from '@/components/LakeDetailPanel';
import { GlacierLake } from '@/data/lakesData';
import UploadDataPage from "@/components/uploaddatapage"
import AuthModal from '@/components/AuthModal';

interface User {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  photo: string | null;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLake, setSelectedLake] = useState<GlacierLake | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({
    riskLevels: ['high', 'medium', 'low'],
    yearRange: [2018, 2024] as [number, number],
    searchQuery: '',
  });

  // Check for logged in user on mount
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Update user state when auth modal closes (after login/register)
  const handleAuthClose = (open: boolean) => {
    setAuthModalOpen(open);
    if (!open) {
      // Check if user is now logged in
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    onTabChange('dashboard');
  };

  const handleLakeSelect = (lake: GlacierLake) => {
    setSelectedLake(lake);
  };

  const handleClosePanel = () => {
    setSelectedLake(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNavbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAuthClick={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={handleAuthClose} />

      {/* Main Content */}
      <main className="pt-16 h-screen">
  {activeTab === "dashboard" && (
    <div className="relative h-full">
      {/* Filter Sidebar */}
      <FilterSidebar filters={filters} onFiltersChange={setFilters} />

      {/* Map View */}
      <div className="h-full ml-64 transition-all duration-300">
        <MapView
          filters={filters}
          onLakeSelect={handleLakeSelect}
          selectedLake={selectedLake}
        />
      </div>

     

      {/* Lake Detail Panel */}
      <LakeDetailPanel lake={selectedLake} onClose={handleClosePanel} />

      {/* Mobile overlay */}
      {selectedLake && (
        <div
          className="fixed inset-0 z-30 sm:hidden"
          onClick={handleClosePanel}
        />
      )}
    </div>
  )}

  {activeTab === "upload" && (
    <UploadDataPage />
  )}

  {activeTab === "insights" && (
    <div className="flex items-center justify-center h-full">
      <div className="glass-panel p-8 text-center max-w-md">
        <h2 className="text-xl font-bold mb-2">Model Insights</h2>
        <p className="text-muted-foreground">
          This section is coming soon.
        </p>
      </div>
    </div>
  )}

  {activeTab === "about" && (
    <div className="flex items-center justify-center h-full">
      <div className="glass-panel p-8 text-center max-w-md">
        <h2 className="text-xl font-bold mb-2">About GLOF Predictor</h2>
        <p className="text-muted-foreground">
          Glacier Lake Outburst Flood prediction and monitoring system.
        </p>
      </div>
    </div>
  )}
</main>

    </div>
  );
};

export default Index;
