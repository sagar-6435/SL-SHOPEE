import { FaTemperatureLow, FaRotate, FaGlassWaterDroplet, FaFan, FaFireBurner, FaKitchenSet, FaMobileScreenButton, FaTv, FaCouch, FaSnowflake, FaBowlRice, FaMugHot } from "react-icons/fa6";
import samsungTv from "@/assets/products/4K Ultra HD Smart TV.jpg";
import sonyTv from "@/assets/products/OLED Bravia TV.jpg";
import vivoPhone from "@/assets/products/Smartphone Pro 5G.jpg";
import realmePhone from "@/assets/products/Realme Note 60.jpg";
import washingMachine from "@/assets/products/Front Load Washing Machine.jpg";
import washingMachineAlt from "@/assets/products/Semi Auto Washer.jpg";
import airConditioner from "@/assets/products/1.5 Ton Split AC 5-Star.jpg";
import airConditionerAlt from "@/assets/products/Inverter Split AC.jpg";
import sofa from "@/assets/products/L-Shape Fabric Sofa.jpg";
import sofaAlt from "@/assets/products/Recliner Chair.jpg";
import waterPurifier from "@/assets/products/RO+UV Water Purifier.jpg";
import microwave from "@/assets/products/Convection Microwave.jpg";

export const SITE = {
  name: "SL SHOPEE",
  tagline: "Electronics & Home Furniture Showroom",
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  email: "hello@slshopee.in",
  hours: "Mon – Sun · 9:30 AM – 9:00 PM",
};

export const BRANCHES = [
  { slug: "achampeta", name: "Achampeta (Kakinada)", address: "Main Road, Achampeta, Kakinada, Andhra Pradesh", phone: "+91 90000 00001" },
  { slug: "pithapuram", name: "Pithapuram", address: "Bazaar Street, Pithapuram, Andhra Pradesh", phone: "+91 90000 00002" },
  { slug: "kathipudi", name: "Kathipudi", address: "NH-16, Kathipudi, Andhra Pradesh", phone: "+91 90000 00003" },
  { slug: "gollaprolu", name: "Gollaprolu", address: "Main Road, Gollaprolu, Andhra Pradesh", phone: "+91 90000 00004" },
  { slug: "peddapuram", name: "Peddapuram", address: "Market Road, Peddapuram, Andhra Pradesh", phone: "+91 90000 00005" },
];

export const CATEGORIES = [
  { icon: FaTv, name: "Televisions" },
  { icon: FaMobileScreenButton, name: "Smartphones" },
  { icon: FaCouch, name: "Furniture" },
  { icon: FaTemperatureLow, name: "Air Conditioners" },
  { icon: FaRotate, name: "Washing Machines" },
  { icon: FaSnowflake, name: "Air Coolers" },
  { icon: FaGlassWaterDroplet, name: "Water Purifiers" },
  { icon: FaKitchenSet, name: "Kitchen Appliances" },
  { icon: FaFireBurner, name: "Microwave Ovens" },
  { icon: FaBowlRice, name: "Rice Cookers" },
  { icon: FaFan, name: "Fans" },
  { icon: FaMugHot, name: "Kettles" },
];

export const BRANDS = [
  "Samsung", "LG", "Sony", "Whirlpool", "IFB", "Haier",
  "Vivo", "Oppo", "Realme", "OnePlus", "Panasonic", "Philips",
];

export const PRODUCTS = [
  { name: "4K Ultra HD Smart TV", brand: "Samsung", price: "₹49,990", category: "Televisions", image: samsungTv },
  { name: "OLED Bravia TV", brand: "Sony", price: "₹1,29,990", category: "Televisions", image: sonyTv },
  { name: "Smartphone Pro 5G", brand: "Vivo", price: "₹32,999", category: "Smartphones", image: vivoPhone },
  { name: "Realme Note 60", brand: "Realme", price: "₹12,499", category: "Smartphones", image: realmePhone },
  { name: "Front Load Washing Machine", brand: "IFB", price: "₹34,490", category: "Washing Machines", image: washingMachine },
  { name: "Semi Auto Washer", brand: "Whirlpool", price: "₹14,990", category: "Washing Machines", image: washingMachineAlt },
  { name: "1.5 Ton Split AC 5-Star", brand: "LG", price: "₹41,990", category: "Air Conditioners", image: airConditioner },
  { name: "Inverter Split AC", brand: "Haier", price: "₹36,490", category: "Air Conditioners", image: airConditionerAlt },
  { name: "L-Shape Fabric Sofa", brand: "SL Shopee", price: "₹28,999", category: "Furniture", image: sofa },
  { name: "Recliner Chair", brand: "SL Shopee", price: "₹18,499", category: "Furniture", image: sofaAlt },
  { name: "RO+UV Water Purifier", brand: "Kent", price: "₹13,999", category: "Water Purifiers", image: waterPurifier },
  { name: "Convection Microwave", brand: "Panasonic", price: "₹10,990", category: "Kitchen Appliances", image: microwave },
];

export const TESTIMONIALS = [
  { name: "Ravi Kumar", role: "Pithapuram", text: "Bought a Sony TV at the best price in town. Staff explained every feature clearly." },
  { name: "Lakshmi Devi", role: "Kakinada", text: "Great EMI options and quick home delivery. Very happy with my new washing machine." },
  { name: "Suresh Babu", role: "Peddapuram", text: "Trusted brand names and honest pricing — SL SHOPEE is our family go-to store." },
  { name: "Anitha S.", role: "Gollaprolu", text: "Excellent after-sales service. They installed our AC on the same day!" },
];

export function waLink(message = "Hi SL SHOPEE, I'd like to enquire about a product.") {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/branches", label: "Branches" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;