import React, { createContext, useContext, useState, ReactNode } from "react";
import * as Location from "expo-location";

export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: any;
  sellerName: string;
  sellerAvatar: string;
  location: string;
  latitude: number;
  longitude: number;
  isUserGig?: boolean;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

interface GigContextType {
  gigs: Gig[];
  userGigs: Gig[];
  isOnline: boolean;
  userLocation: UserLocation | null;
  toggleOnline: () => Promise<void>;
  addGig: (gig: Omit<Gig, "id" | "sellerName" | "sellerAvatar" | "isUserGig">) => void;
  deleteGig: (id: string) => void;
}

const GigContext = createContext<GigContextType | undefined>(undefined);

const initialGigs: Gig[] = [
  {
    id: "1",
    title: "Fresh Homemade Lasagna",
    description: "Authentic Italian lasagna made with fresh ingredients. Perfect for family dinners or special occasions. Serves 6-8 people.",
    price: 45,
    category: "Food",
    image: require("../../assets/images/gigs/lasagna.jpg"),
    sellerName: "Maria S.",
    sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    location: "Williamsburg, Brooklyn",
    latitude: 40.7081,
    longitude: -73.9571,
  },
  {
    id: "2",
    title: "Professional Dog Walking",
    description: "Experienced dog walker offering daily walks in Prospect Park. 30-60 minute sessions available. All breeds welcome!",
    price: 25,
    category: "Services",
    image: require("../../assets/images/gigs/dog-walking.jpg"),
    sellerName: "Jake T.",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    location: "Park Slope, Brooklyn",
    latitude: 40.6710,
    longitude: -73.9771,
  },
  {
    id: "3",
    title: "Custom Tattoo Session",
    description: "Professional tattoo artist specializing in minimalist and fine line designs. Consultation included. Clean, safe studio.",
    price: 150,
    category: "Art",
    image: require("../../assets/images/gigs/tattoo.jpg"),
    sellerName: "Alex M.",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    location: "Bushwick, Brooklyn",
    latitude: 40.6942,
    longitude: -73.9213,
  },
];

export function GigProvider({ children }: { children: ReactNode }) {
  const [gigs, setGigs] = useState<Gig[]>(initialGigs);
  const [isOnline, setIsOnline] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const userGigs = gigs.filter((gig) => gig.isUserGig);

  const toggleOnline = async () => {
    if (isOnline) {
      setIsOnline(false);
      setUserLocation(null);
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setIsOnline(true);
    }
  };

  const addGig = (gigData: Omit<Gig, "id" | "sellerName" | "sellerAvatar" | "isUserGig">) => {
    const newGig: Gig = {
      ...gigData,
      id: Date.now().toString(),
      sellerName: "Demo User",
      sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      isUserGig: true,
    };
    setGigs((prev) => [newGig, ...prev]);
  };

  const deleteGig = (id: string) => {
    setGigs((prev) => prev.filter((gig) => gig.id !== id));
  };

  return (
    <GigContext.Provider
      value={{
        gigs,
        userGigs,
        isOnline,
        userLocation,
        toggleOnline,
        addGig,
        deleteGig,
      }}
    >
      {children}
    </GigContext.Provider>
  );
}

export function useGigs() {
  const context = useContext(GigContext);
  if (context === undefined) {
    throw new Error("useGigs must be used within a GigProvider");
  }
  return context;
}
