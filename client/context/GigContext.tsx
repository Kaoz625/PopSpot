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
  addGig: (
    gig: Omit<Gig, "id" | "sellerName" | "sellerAvatar" | "isUserGig">,
  ) => void;
  deleteGig: (id: string) => void;
}

const GigContext = createContext<GigContextType | undefined>(undefined);

const initialGigs: Gig[] = [
  {
    id: "1",
    title: "Fresh Homemade Lasagna",
    description:
      "Authentic Italian lasagna made with fresh ingredients. Perfect for family dinners or special occasions. Serves 6-8 people.",
    price: 45,
    category: "Food",
    image: require("../../assets/images/gigs/lasagna.jpg"),
    sellerName: "Maria S.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    location: "Williamsburg, Brooklyn",
    latitude: 40.7081,
    longitude: -73.9571,
  },
  {
    id: "2",
    title: "Professional Dog Walking",
    description:
      "Experienced dog walker offering daily walks in Prospect Park. 30-60 minute sessions available. All breeds welcome!",
    price: 25,
    category: "Services",
    image: require("../../assets/images/gigs/dog-walking.jpg"),
    sellerName: "Jake T.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    location: "Park Slope, Brooklyn",
    latitude: 40.671,
    longitude: -73.9771,
  },
  {
    id: "3",
    title: "Custom Tattoo Session",
    description:
      "Professional tattoo artist specializing in minimalist and fine line designs. Consultation included. Clean, safe studio.",
    price: 150,
    category: "Art",
    image: require("../../assets/images/gigs/tattoo.jpg"),
    sellerName: "Alex M.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    location: "Bushwick, Brooklyn",
    latitude: 40.6942,
    longitude: -73.9213,
  },
  {
    id: "4",
    title: "Math & Science Tutoring",
    description:
      "Experienced tutor for grades 6-12. SAT prep available. Patient, encouraging approach. In-person or video sessions.",
    price: 50,
    category: "Tutoring",
    image: require("../../assets/images/gigs/tutoring.jpg"),
    sellerName: "David L.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    location: "Brooklyn Heights",
    latitude: 40.696,
    longitude: -73.9936,
  },
  {
    id: "5",
    title: "Personal Training Sessions",
    description:
      "Certified personal trainer offering 1-on-1 sessions. Weight loss, strength training, or flexibility. First session free!",
    price: 75,
    category: "Fitness",
    image: require("../../assets/images/gigs/fitness.jpg"),
    sellerName: "Chris R.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
    location: "DUMBO, Brooklyn",
    latitude: 40.7033,
    longitude: -73.9881,
  },
  {
    id: "6",
    title: "Computer Repair & Setup",
    description:
      "Fast, affordable tech support. Laptop repairs, virus removal, data recovery, and new device setup. Same-day service available.",
    price: 65,
    category: "Tech",
    image: require("../../assets/images/gigs/tech.jpg"),
    sellerName: "Sam K.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    location: "Fort Greene, Brooklyn",
    latitude: 40.6892,
    longitude: -73.9745,
  },
  {
    id: "7",
    title: "Professional Braiding",
    description:
      "Expert braider specializing in box braids, cornrows, twists, and protective styles. Quality hair included. Book now!",
    price: 120,
    category: "Hair Braiding",
    image: require("../../assets/images/gigs/hair-braiding.jpg"),
    sellerName: "Nia J.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop",
    location: "Bed-Stuy, Brooklyn",
    latitude: 40.6872,
    longitude: -73.9418,
  },
  {
    id: "8",
    title: "Deep House Cleaning",
    description:
      "Thorough cleaning service for homes and apartments. Eco-friendly products. Weekly, bi-weekly, or one-time deep cleans.",
    price: 150,
    category: "House Cleaning",
    image: require("../../assets/images/gigs/house-cleaning.jpg"),
    sellerName: "Rosa M.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    location: "Crown Heights, Brooklyn",
    latitude: 40.6694,
    longitude: -73.9422,
  },
  {
    id: "9",
    title: "Handyman Services",
    description:
      "Furniture assembly, minor repairs, painting, and odd jobs. No job too small. Reliable and affordable.",
    price: 55,
    category: "Other",
    image: require("../../assets/images/gigs/handyman.jpg"),
    sellerName: "Marcus W.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    location: "Greenpoint, Brooklyn",
    latitude: 40.7282,
    longitude: -73.9485,
  },
  {
    id: "10",
    title: "Authentic Jerk Chicken",
    description:
      "Caribbean-style jerk chicken with rice and peas. Made with traditional Jamaican spices. Family recipe passed down generations.",
    price: 20,
    category: "Food",
    image: require("../../assets/images/gigs/lasagna.jpg"),
    sellerName: "Keisha B.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    location: "East Flatbush, Brooklyn",
    latitude: 40.6498,
    longitude: -73.9304,
  },
  {
    id: "11",
    title: "Pet Sitting Weekend",
    description:
      "Reliable pet sitter for dogs and cats. Your pet stays at my home with 24/7 care, daily walks, and lots of love!",
    price: 40,
    category: "Services",
    image: require("../../assets/images/gigs/dog-walking.jpg"),
    sellerName: "Amanda P.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    location: "Cobble Hill, Brooklyn",
    latitude: 40.6883,
    longitude: -73.9943,
  },
  {
    id: "12",
    title: "Portrait Photography",
    description:
      "Professional headshots and portrait sessions. Perfect for LinkedIn, dating profiles, or personal branding. Includes 10 edited photos.",
    price: 175,
    category: "Art",
    image: require("../../assets/images/gigs/tattoo.jpg"),
    sellerName: "Jordan C.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop",
    location: "Williamsburg, Brooklyn",
    latitude: 40.7144,
    longitude: -73.961,
  },
  {
    id: "13",
    title: "Piano Lessons",
    description:
      "Experienced piano teacher for all ages and skill levels. Classical, jazz, or pop. In-home lessons available.",
    price: 60,
    category: "Tutoring",
    image: require("../../assets/images/gigs/tutoring.jpg"),
    sellerName: "Claire H.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    location: "Carroll Gardens, Brooklyn",
    latitude: 40.6795,
    longitude: -73.9991,
  },
  {
    id: "14",
    title: "Yoga Private Sessions",
    description:
      "Personalized yoga sessions in your home or outdoors. Vinyasa, Hatha, or Restorative. All levels welcome, equipment provided.",
    price: 80,
    category: "Fitness",
    image: require("../../assets/images/gigs/fitness.jpg"),
    sellerName: "Mia L.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop",
    location: "Prospect Heights, Brooklyn",
    latitude: 40.6773,
    longitude: -73.9636,
  },
  {
    id: "15",
    title: "iPhone Screen Repair",
    description:
      "Quick and affordable iPhone screen replacements. All models supported. 30-minute service with 90-day warranty.",
    price: 85,
    category: "Tech",
    image: require("../../assets/images/gigs/tech.jpg"),
    sellerName: "Tyler N.",
    sellerAvatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    location: "Downtown Brooklyn",
    latitude: 40.693,
    longitude: -73.9842,
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

  const addGig = (
    gigData: Omit<Gig, "id" | "sellerName" | "sellerAvatar" | "isUserGig">,
  ) => {
    const newGig: Gig = {
      ...gigData,
      id: Date.now().toString(),
      sellerName: "Demo User",
      sellerAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
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
