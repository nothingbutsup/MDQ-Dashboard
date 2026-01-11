import { User } from "./types";
import { Shirt, Utensils, SprayCan, Trash2 } from "lucide-react";

export const USERS: User[] = [
  { id: 'mate', name: 'Mate', colorBg: 'bg-blue-500/20', colorText: 'text-blue-400', colorBorder: 'border-blue-500/30' },
  { id: 'joako', name: 'Joako', colorBg: 'bg-orange-500/20', colorText: 'text-orange-400', colorBorder: 'border-orange-500/30' },
  { id: 'luqui', name: 'Luqui', colorBg: 'bg-emerald-500/20', colorText: 'text-emerald-400', colorBorder: 'border-emerald-500/30' },
  { id: 'agus', name: 'Agus', colorBg: 'bg-pink-500/20', colorText: 'text-pink-400', colorBorder: 'border-pink-500/30' },
  { id: 'mastro', name: 'Mastro', colorBg: 'bg-yellow-500/20', colorText: 'text-yellow-400', colorBorder: 'border-yellow-500/30' }
];

export const CHORES = [
    { id: 'c1', name: "Laundry Duty", value: -1, Icon: Shirt, description: "Wash, dry, and fold." },
    { id: 'c2', name: "Dishes", value: -1, Icon: SprayCan, description: "Empty sink and load dishwasher." },
    { id: 'c3', name: "Deep Clean", value: -2, Icon: Trash2, description: "Vacuum and mop common areas." },
    { id: 'c4', name: "Cook Dinner", value: -4, Icon: Utensils, description: "Prepare meal for the group." }
];