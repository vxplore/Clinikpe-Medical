import { API_KEY } from "../../KEY";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRegistrationStore } from "../../stores/registrationStore";

// ─── Type declarations ────────────────────────────────────────────────────────
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        TrafficLayer: any;
        Geocoder: any;
        SymbolPath: any;
        GeocoderStatus: any;
        event: {
          addListener: (target: any, event: string, cb: () => void) => void;
        };
        places: {
          AutocompleteService: any;
          PlacesService: any;
          PlacesServiceStatus: any;
        };
      };
    };
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1a1f2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a9bb0" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1f2e" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2c3a50" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#253545" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3a4f6a" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0d1b2a" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#1e2a38" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1e2a38" }],
  },
];

// ─── Google Maps loader (singleton) ──────────────────────────────────────────
let mapsPromise: Promise<void> | null = null;
const loadGoogleMaps = (apiKey: string): Promise<void> => {
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) return resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return mapsPromise;
};

// ─── Location type ────────────────────────────────────────────────────────────
interface SelectedLocation {
  lat: number;
  lng: number;
  address: string;
  shortName: string;
  city: string;
  country: string;
}

// ─── LocationConfirmDrawer ────────────────────────────────────────────────────
interface DrawerProps {
  location: SelectedLocation | null;
  loading: boolean;
  onConfirm: (loc: SelectedLocation) => void;
  onCancel: () => void;
}

function LocationConfirmDrawer({
  location,
  loading,
  onConfirm,
  onCancel,
}: DrawerProps) {
  const visible = !!location || loading;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[999] transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-[110%] opacity-0 pointer-events-none"
      }`}
    >
      {/* Pill handle */}
      <div className="flex justify-center pb-2">
        <div className="w-10 h-1 rounded-sm bg-white/30" />
      </div>

      <div className="p-4 bg-white rounded-t-lg shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        {/* Pin icon + address block */}
        <div className="flex gap-3.5 items-start mb-5">
          {/* Animated pin */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/35">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="#fff"
              />
              <circle cx="12" cy="9" r="2.5" fill="rgba(255,255,255,0.4)" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase m-0 mb-1">
              Selected Location
            </p>

            {loading ? (
              <>
                <div className="h-[18px] bg-slate-100 rounded-md w-3/4 mb-2 animate-pulse" />
                <div className="h-[13px] bg-slate-100 rounded-md w-1/2 animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-[15px] font-bold text-slate-900 m-0 mb-[3px] leading-snug truncate">
                  {location?.shortName || "—"}
                </p>
                <p className="text-xs text-slate-500 m-0 truncate">
                  {location?.address || ""}
                </p>
                <p className="text-[11px] font-medium text-slate-400 m-0 mt-0.5">
                  {location
                    ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
                    : ""}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-sans text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => location && onConfirm(location)}
            disabled={loading || !location}
            className="flex-[2] py-1 rounded-xl border-none bg-[#0d52af] text-white font-sans text-sm font-bold shadow-lg shadow-blue-600/35 transition-all hover:bg-blue-800 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-slate-300 disabled:text-slate-500"
          >
            {loading ? "Fetching address…" : "Confirm Location"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  apiKey: string;
  lat?: number;
  lng?: number;
  height?: string;
  onLocationConfirmed?: (location: SelectedLocation) => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LocationMapView({
  apiKey,
  lat = 98.6139,
  lng = 77.209,
  height = "100dvh",
  onLocationConfirmed,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAddress } = useRegistrationStore();

  // Get address coordinates from navigation state if available
  const addressState = useMemo(() => {
    return (location.state as any)?.lat
      ? { lat: (location.state as any).lat, lng: (location.state as any).lng }
      : null;
  }, [location.state]);

  const initialLat = addressState?.lat || lat;
  const initialLng = addressState?.lng || lng;

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const trafficLayerRef = useRef<any>(null);
  const centerMarkerRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const placesRef = useRef<any>(null);
  const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleListenerRef = useRef<any>(null);

  const [mapsReady, setMapsReady] = useState(false);
  const [traffic, setTraffic] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentLat, setCurrentLat] = useState(initialLat);
  const [currentLng, setCurrentLng] = useState(initialLng);

  // ── Load Maps ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const effectiveApiKey = apiKey || API_KEY.GOOGLE_API_KEY;
    if (!effectiveApiKey) return;

    loadGoogleMaps(effectiveApiKey)
      .then(() => setMapsReady(true))
      .catch(console.error);
  }, [apiKey]);

  // ── Request Geolocation ────────────────────────────────────────────────────
  useEffect(() => {
    // Skip geolocation if we already have address coordinates from navigation state
    if (addressState) return;

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setCurrentLat(userLat);
        setCurrentLng(userLng);
      },
      (error) => {
        console.warn("Geolocation error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [addressState]);

  // ── Reverse Geocode ────────────────────────────────────────────────────────
  const reverseGeocode = useCallback((rlat: number, rlng: number) => {
    if (!geocoderRef.current) return;
    setGeocodeLoading(true);

    geocoderRef.current.geocode(
      { location: { lat: rlat, lng: rlng } },
      (results: any[], status: string) => {
        setGeocodeLoading(false);
        if (
          status === window.google.maps.GeocoderStatus.OK &&
          results.length > 0
        ) {
          const res = results[0];
          const comps = res.address_components as any[];

          const get = (type: string) =>
            comps.find((c: any) => c.types.includes(type))?.long_name || "";

          const premise = get("premise");
          const route = get("route");
          const sublocality = get("sublocality_level_1") || get("sublocality");
          const locality = get("locality");
          const adminArea = get("administrative_area_level_1");
          const country = get("country");
          const postalCode = get("postal_code");

          const shortName =
            [premise || route, sublocality].filter(Boolean).join(", ") ||
            locality ||
            res.formatted_address.split(",")[0];

          const address = [
            premise || route,
            sublocality,
            locality,
            adminArea,
            postalCode,
            country,
          ]
            .filter(Boolean)
            .join(", ");

          setSelectedLocation({
            lat: rlat,
            lng: rlng,
            address,
            shortName,
            city: locality,
            country,
          });
          setDrawerOpen(true);
        } else {
          setSelectedLocation({
            lat: rlat,
            lng: rlng,
            address: `${rlat.toFixed(5)}, ${rlng.toFixed(5)}`,
            shortName: "Unknown location",
            city: "",
            country: "",
          });
          setDrawerOpen(true);
        }
      },
    );
  }, []);

  // ── Init Map ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapsReady || !mapContainerRef.current) return;

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: { lat: currentLat, lng: currentLng },
      zoom: 15,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      clickableIcons: false,
    });
    mapRef.current = map;

    centerMarkerRef.current = new window.google.maps.Marker({
      position: { lat: currentLat, lng: currentLng },
      map,
      title: "Selected Location",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 11,
        fillColor: "#2563eb",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 3,
      },
      zIndex: 100,
    });

    trafficLayerRef.current = new window.google.maps.TrafficLayer();
    autocompleteRef.current =
      new window.google.maps.places.AutocompleteService();
    placesRef.current = new window.google.maps.places.PlacesService(map);
    geocoderRef.current = new window.google.maps.Geocoder();

    idleListenerRef.current = window.google.maps.event.addListener(
      map,
      "idle",
      () => {
        const center = map.getCenter();
        if (!center) return;
        const clat = center.lat();
        const clng = center.lng();
        centerMarkerRef.current?.setPosition({ lat: clat, lng: clng });

        if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
        geocodeTimerRef.current = setTimeout(() => {
          reverseGeocode(clat, clng);
        }, 400);
      },
    );

    // Initial geocode - defer to avoid cascading renders
    const initialGeocodeTimer = setTimeout(() => {
      reverseGeocode(currentLat, currentLng);
    }, 0);

    return () => {
      clearTimeout(initialGeocodeTimer);
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    };
  }, [mapsReady, currentLat, currentLng, reverseGeocode]);

  // ── Search ─────────────────────────────────────────────────────────────────
  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (val.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    autocompleteRef.current?.getPlacePredictions(
      { input: val },
      (predictions: any[], status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSearchResults(predictions || []);
          setShowResults(true);
        }
      },
    );
  };

  const handleSelectFromSearch = (placeId: string) => {
    placesRef.current?.getDetails(
      {
        placeId,
        fields: ["geometry", "formatted_address", "address_components", "name"],
      },
      (place: any, status: string) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) return;
        const nlat = place.geometry.location.lat();
        const nlng = place.geometry.location.lng();
        mapRef.current?.panTo({ lat: nlat, lng: nlng });
        mapRef.current?.setZoom(16);
        setSearchInput("");
        setSearchResults([]);
        setShowResults(false);
      },
    );
  };

  // ── Toggles ────────────────────────────────────────────────────────────────
  const toggleTraffic = useCallback(() => {
    const next = !traffic;
    setTraffic(next);
    trafficLayerRef.current?.setMap(next ? mapRef.current : null);
  }, [traffic]);

  const toggleDarkMode = useCallback(() => {
    const next = !darkMode;
    setDarkMode(next);
    mapRef.current?.setOptions({ styles: next ? DARK_STYLE : [] });
  }, [darkMode]);

  const handleResetToOriginal = useCallback(() => {
    mapRef.current?.panTo({ lat: currentLat, lng: currentLng });
  }, [currentLat, currentLng]);

  const handleConfirm = (loc: SelectedLocation) => {
    setDrawerOpen(false);
    setAddress({
      name: loc.shortName || loc.address,
      lat: loc.lat,
      lng: loc.lng,
    });
    onLocationConfirmed?.(loc);
    navigate(-1);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Main Wrapper */}
      <div
        className="relative w-full overflow-hidden font-sans"
        style={{ height }}
      >
        {/* Map Container */}
        <div ref={mapContainerRef} className="w-full h-full bg-gray-200" />

        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="4" fill="#2563eb" />
            <circle
              cx="20"
              cy="20"
              r="8"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
            <line
              x1="20"
              y1="4"
              x2="20"
              y2="14"
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="20"
              y1="26"
              x2="20"
              y2="36"
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="20"
              x2="14"
              y2="20"
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="26"
              y1="20"
              x2="36"
              y2="20"
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Top bar */}
        <div className="absolute top-4 left-3 right-3 z-50 flex gap-2.5 items-center">
          {/* Back */}
          <button
            onClick={() => window.history.back()}
            className="w-11 h-11 rounded-xl bg-white shadow-md flex items-center justify-center cursor-pointer shrink-0 border-none transition-colors hover:bg-slate-50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#374151"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 relative">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search for a place…"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-white shadow-md text-sm font-medium text-slate-900 outline-none box-border border-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearchResults([]);
                    setShowResults(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0.5"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search results dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.16)] max-h-[260px] overflow-y-auto z-[100]">
                {searchResults.map((r, i) => (
                  <div
                    key={r.place_id}
                    onClick={() => handleSelectFromSearch(r.place_id)}
                    className={`flex items-center gap-3 py-3 px-3.5 cursor-pointer transition-colors hover:bg-slate-50 ${
                      i < searchResults.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="#2563eb"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="m-0 text-[13px] font-semibold text-slate-900 truncate">
                        {r.structured_formatting?.main_text}
                      </p>
                      <p className="m-0 mt-[1px] text-[11px] text-slate-400 truncate">
                        {r.structured_formatting?.secondary_text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side controls */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          <button
            onClick={toggleTraffic}
            title="Toggle traffic"
            className={`w-10 h-10 rounded-xl border-none shadow-md flex items-center justify-center cursor-pointer transition-colors ${
              traffic
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="9" y="2" width="6" height="20" rx="3" />
              <circle cx="12" cy="6" r="1.5" fill="#ef4444" stroke="none" />
              <circle cx="12" cy="12" r="1.5" fill="#f59e0b" stroke="none" />
              <circle cx="12" cy="18" r="1.5" fill="#22c55e" stroke="none" />
            </svg>
          </button>

          <button
            onClick={toggleDarkMode}
            title="Toggle dark mode"
            className={`w-10 h-10 rounded-xl border-none shadow-md flex items-center justify-center cursor-pointer transition-colors ${
              darkMode
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>

          <button
            onClick={handleResetToOriginal}
            title="Reset to original"
            className="w-10 h-10 rounded-xl border-none shadow-md flex items-center justify-center cursor-pointer transition-colors bg-white text-slate-700 hover:bg-slate-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
            </svg>
          </button>
        </div>

        {/* Drag hint */}
        {!geocodeLoading && (
          <div className="absolute top-[calc(50%+30px)] left-1/2 -translate-x-1/2 bg-slate-900/80 text-white text-[11px] font-medium py-1.5 px-3 rounded-full whitespace-nowrap pointer-events-none z-10 backdrop-blur-sm">
            Drag map to select location
          </div>
        )}

        {/* No API key warning */}
        {!apiKey && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 z-[200]">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-[15px] font-semibold text-slate-900 m-0">
              Google Maps API key required
            </p>
            <p className="text-xs text-slate-500 m-0">
              Pass the <code className="bg-slate-100 px-1 rounded">apiKey</code>{" "}
              prop to use this component
            </p>
          </div>
        )}

        {/* Confirm Drawer */}
        <LocationConfirmDrawer
          location={drawerOpen ? selectedLocation : null}
          loading={geocodeLoading}
          onConfirm={handleConfirm}
          onCancel={() => setDrawerOpen(false)}
        />
      </div>
    </>
  );
}
