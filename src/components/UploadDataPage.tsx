import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, MapPin, Image, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/* -------------------- TYPES -------------------- */

interface GeoapifyResult {
  place_id: string;
  lat: number;
  lon: number;
  formatted: string;
  address_line1?: string;
  address_line2?: string;
  result_type?: string;
  rank?: {
    confidence?: number;
  };
}

/* -------------------- COMPONENT -------------------- */

const UploadDataPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoapifyResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GeoapifyResult | null>(null);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /* -------------------- IMAGE HANDLERS -------------------- */

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* -------------------- LOCATION SEARCH -------------------- */

  const handleLocationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationQuery(value);
    setSelectedLocation(null);

    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    setShowSuggestions(true);

    // Abort previous request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsSearching(true);

    const params = new URLSearchParams({
      text: value,
      type: 'locality',
      limit: '5',
      format: 'json',
      bias: 'countrycode:np,in',
      apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY,
    });

    fetch(`https://api.geoapify.com/v1/geocode/search?${params}`, {
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => {
        setSuggestions(data.results || []);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Geoapify error:', err);
        }
      })
      .finally(() => setIsSearching(false));
  };

  const handleLocationSelect = (place: GeoapifyResult) => {
    setSelectedLocation(place);
    setLocationQuery(place.formatted);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async () => {
    if (!selectedImage || !selectedLocation) return;

    const payload = {
      image: {
        name: selectedImage.name,
        size: selectedImage.size,
        type: selectedImage.type,
      },
      location: {
        lat: selectedLocation.lat,
        lon: selectedLocation.lon,
        place_id: selectedLocation.place_id,
        formatted: selectedLocation.formatted,
        confidence: selectedLocation.rank?.confidence ?? null,
        result_type: selectedLocation.result_type ?? null,
      },
    };

    console.log('UPLOAD PAYLOAD →', payload);

    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 1500));
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  const isFormValid = Boolean(selectedImage && selectedLocation);

  /* -------------------- UI -------------------- */

  return (
    <div className="flex items-center justify-center min-h-full p-6">
      <div className="glass-panel p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Upload Data</h2>

        {/* IMAGE UPLOAD */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3">
            <Image className="inline w-4 h-4 mr-2" />
            Lake Image
          </label>

          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary"
            >
              <Upload className="mx-auto w-8 h-8 mb-3 text-muted-foreground" />
              <p className="font-medium">Click to upload image</p>
              <p className="text-xs text-muted-foreground">PNG / JPG up to 10MB</p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border">
              <img src={imagePreview} className="w-full h-48 object-cover" />
              <button
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 bg-background p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        {/* LOCATION */}
        <div className="mb-8 relative">
          <label className="block text-sm font-medium mb-3">
            <MapPin className="inline w-4 h-4 mr-2" />
            Location
          </label>

          <Input
            value={locationQuery}
            onChange={handleLocationInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search glacier lake location..."
          />

          {showSuggestions && !selectedLocation && (
            <div className="absolute z-10 w-full mt-2 bg-card border rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {isSearching && (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  Searching...
                </div>
              )}

              {!isSearching &&
                suggestions.map(place => (
                  <button
                    key={place.place_id}
                    onClick={() => handleLocationSelect(place)}
                    className="w-full px-4 py-3 text-left hover:bg-secondary"
                  >
                    <p className="text-sm font-medium">
                      {place.address_line1 ?? place.formatted}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {place.address_line2}
                    </p>
                  </button>
                ))}

              {!isSearching && suggestions.length === 0 && (
                <div className="px-4 py-4 text-sm text-muted-foreground text-center">
                  No locations found
                </div>
              )}
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="w-full h-12"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading…
            </>
          ) : submitSuccess ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Uploaded
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Submit Data
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UploadDataPage;
