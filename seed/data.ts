import { Pkgs, Users } from "../lib/types";

export const pkgsData: Pkgs[] = [
  {
    name: "Basic",
    price: 29.0,
    features: [
      "720p Video Rendering",
      "2GB Cloud Storage",
      "Basic Video Templates",
    ],
  },
  {
    name: "Pro",
    price: 59.0,
    popular: true,
    features: [
      "1080p Video Rendering",
      "10GB Cloud Storage",
      "Premium Video Templates",
      "Collaboration Tools",
    ],
  },
  {
    name: "Enterprise",
    price: 99.0,
    features: [
      "4K Video Rendering",
      "Unlimited Cloud Storage",
      "Custom Video Templates",
      "Advanced Collaboration Tools",
      "Dedicated Support",
    ],
  },
];

export const userData: Users[] = [
  {
    firstName: "Randolf",
    lastName: "Marsh",
    email: "michaelvrms@gmail.com",
    password: "password",
  },
];
