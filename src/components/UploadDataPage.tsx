import { useState, useRef } from 'react';
import { Upload, X, MapPin, Image, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LOCATION_SUGGESTIONS = [
  { id: 1, name: 'Tsho Rolpa Lake', region: 'Dolakha, Nepal', coords: [27.8617, 86.4767] },
  { id: 2, name: 'Imja Lake', region: 'Solukhumbu, Nepal', coords: [27.9000, 86.9333] },
  { id: 3, name: 'Thulagi Lake', region: 'Manang, Nepal', coords: [28.4833, 84.4667] },
  { id: 4, name: 'Lower Barun Lake', region: 'Sankhuwasabha, Nepal', coords: [27.7833, 87.0833] },
  { id: 5, name: 'Dig Tsho Lake', region: 'Solukhumbu, Nepal', coords: [27.8667, 86.5833] },
  { id: 6, name: 'Lumding Lake', region: 'Taplejung, Nepal', coords: [27.6500, 87.9167] },
  { id: 7, name: 'Chamlang Lake', region: 'Sankhuwasabha, Nepal', coords: [27.7500, 86.9833] },
  { id: 8, name: 'Tso Moriri Lake', region: 'Ladakh, India', coords: [32.9167, 78.3167] },
  { id: 9, name: 'Pangong Lake', region: 'Ladakh, India', coords: [33.7500, 78.6667] },
  { id: 10, name: 'Lake Palcacocha', region: 'Ancash, Peru', coords: [-9.3950, -77.3817] },
];

const UploadDataPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const filteredSuggestions = LOCATION_SUGGESTIONS.filter(loc =>
    loc.name.toLowerCase().includes(locationQuery.toLowerCase()) ||
    loc.region.toLowerCase().includes(locationQuery.toLowerCase())
  );

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationQuery(location.name);
    setShowSuggestions(false);
  };

  const handleLocationInputChange = (e) => {
    setLocationQuery(e.target.value);
    setSelectedLocation(null);
    setShowSuggestions(true);
  };

  const handleSubmit = async () => {
    if (!selectedImage || !selectedLocation) return;

    setIsSubmitting(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset after success
    setTimeout(() => {
      setSubmitSuccess(false);
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedLocation(null);
      setLocationQuery('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 3000);
  };

  const isFormValid = selectedImage && selectedLocation;

  return (
    <div className="flex items-center justify-center min-h-full p-6">
      <div className="bg-black border border-border p-8 w-full max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Upload Data</h2>
          <p className="text-muted-foreground text-sm">
            Upload glacier lake images for risk assessment analysis
          </p>
        </div>

        {/* Image Upload Area */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-foreground mb-3">
            <Image className="w-4 h-4 inline mr-2" />
            Lake Image
          </label>
          
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-foreground font-medium mb-1">Click to upload image</p>
              <p className="text-muted-foreground text-sm">PNG, JPG up to 10MB</p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                <p className="text-sm text-foreground truncate">{selectedImage?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedImage?.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Location Selection */}
        <div className="mb-8 relative">
          <label className="block text-sm font-medium text-foreground mb-3">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location
          </label>
          
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for a glacier lake location..."
              value={locationQuery}
              onChange={handleLocationInputChange}
              onFocus={() => setShowSuggestions(true)}
              className="bg-secondary/50 border-border focus:border-primary pr-10"
            />
            {selectedLocation && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Check className="w-5 h-5 text-primary" />
              </div>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && locationQuery && !selectedLocation && (
            <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto scrollbar-thin">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-foreground font-medium text-sm">{location.name}</p>
                        <p className="text-muted-foreground text-xs">{location.region}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                  No locations found matching "{locationQuery}"
                </div>
              )}
            </div>
          )}

          {selectedLocation && (
            <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-foreground text-sm font-medium">{selectedLocation.name}</p>
                <p className="text-muted-foreground text-xs">{selectedLocation.region}</p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className={`w-full h-12 text-base font-medium transition-all duration-200 ${
            submitSuccess 
              ? 'bg-emerald-500 hover:bg-emerald-500' 
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : submitSuccess ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Uploaded Successfully!
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Submit Data
            </>
          )}
        </Button>

        {!isFormValid && (
          <p className="text-center text-muted-foreground text-xs mt-3">
            Please upload an image and select a location to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadDataPage;
