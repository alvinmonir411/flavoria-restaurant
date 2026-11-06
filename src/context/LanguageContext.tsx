'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'bn' | 'fr' | 'es';

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const DICTIONARIES: Record<LanguageCode, Record<string, string>> = {
  en: {
    home: 'Home',
    aboutUs: 'About Us',
    menu: 'Menu',
    tableOrder: 'Table Order',
    reservation: 'Reservation',
    vipClub: 'VIP Club',
    events: 'Events',
    contact: 'Contact',
    bookTable: 'Book a Table',
    exploreMenu: 'Explore Menu',
    goodFoodTag: 'GOOD FOOD | GOOD MOOD',
    heroTitle: 'Delicious Food for Every Mood',
    heroDesc: 'Experience a perfect blend of taste, quality, and ambience. Every dish is crafted with love and passion to bring joy to your table.',
    freshIngredients: 'Fresh Ingredients',
    expertChefs: 'Expert Chefs',
    madeWithLove: 'Made with Love',
    popularDishes: 'Our Popular Dishes',
    viewFullMenu: 'View Full Menu',
    specialOffer: 'Special Offer',
    discount20: 'Get 20% Off On Your First Order',
    findTable: 'Find a Table',
    cart: 'Cart',
    checkout: 'Checkout',
    delivery: 'Delivery',
    takeaway: 'Takeaway',
    dineIn: 'Dine-In',
    splitBill: 'Split Bill',
    requestAssistance: 'Call Waiter',
    requestBill: 'Request Bill',
    management: 'Admin Portal'
  },
  bn: {
    home: 'হোম',
    aboutUs: 'আমাদের সম্পর্কে',
    menu: 'মেনু',
    tableOrder: 'টেবিল অর্ডার',
    reservation: 'বুকিং',
    vipClub: 'ভিআইপি ক্লাব',
    events: 'ইভেন্টস',
    contact: 'যোগাযোগ',
    bookTable: 'টেবিল বুক করুন',
    exploreMenu: 'মেনু দেখুন',
    goodFoodTag: 'সেরা খাবার | সেরা স্বাদ',
    heroTitle: 'প্রতিটি মুহূর্তের জন্য সুস্বাদু খাবার',
    heroDesc: 'স্বাদ, গুণমান এবং চমৎকার পরিবেশের অপূর্ব মিলন। প্রতিটি খাবার ভালোবাসা ও নিখুঁত যত্নে তৈরি।',
    freshIngredients: 'তাজা উপাদান',
    expertChefs: 'অভিজ্ঞ শেফ',
    madeWithLove: 'ভালোবাসায় তৈরি',
    popularDishes: 'আমাদের জনপ্রিয় খাবারসমূহ',
    viewFullMenu: 'সম্পূর্ণ মেনু দেখুন',
    specialOffer: 'বিশেষ অফার',
    discount20: 'আপনার প্রথম অর্ডারে ২০% ছাড় উপভোগ করুন',
    findTable: 'টেবিল খুঁজুন',
    cart: 'কার্ট',
    checkout: 'অর্ডার সম্পন্ন করুন',
    delivery: 'হোম ডেলিভারি',
    takeaway: 'টেকঅ্যাওয়ে',
    dineIn: 'ডাইন-ইন',
    splitBill: 'বিল ভাগ করুন',
    requestAssistance: 'ওয়েটার ডাকুন',
    requestBill: 'বিল চান',
    management: 'অ্যাডমিন পোর্টাল'
  },
  fr: {
    home: 'Accueil',
    aboutUs: 'À Propos',
    menu: 'Carte & Menu',
    tableOrder: 'Commande Table',
    reservation: 'Réservation',
    vipClub: 'Club VIP',
    events: 'Événements',
    contact: 'Contact',
    bookTable: 'Réserver une Table',
    exploreMenu: 'Découvrir la Carte',
    goodFoodTag: 'BONNE CUISINE | BELLE AMBIANCE',
    heroTitle: 'Une Cuisine Exquise pour Chaque Instant',
    heroDesc: 'L’accord parfait entre saveurs pures, excellence des produits et ambiance chaleureuse.',
    freshIngredients: 'Ingrédients Frais',
    expertChefs: 'Chefs Étoilés',
    madeWithLove: 'Fait avec Amour',
    popularDishes: 'Nos Plats Signatures',
    viewFullMenu: 'Voir Toute la Carte',
    specialOffer: 'Offre Spéciale',
    discount20: 'Profitez de -20% sur Votre Première Commande',
    findTable: 'Trouver une Table',
    cart: 'Panier',
    checkout: 'Commander',
    delivery: 'Livraison',
    takeaway: 'À Emporter',
    dineIn: 'Sur Place',
    splitBill: 'Partager l’Addition',
    requestAssistance: 'Appeler le Serveur',
    requestBill: 'Demander l’Addition',
    management: 'Portail Admin'
  },
  es: {
    home: 'Inicio',
    aboutUs: 'Nosotros',
    menu: 'Menú',
    tableOrder: 'Pedido Mesa',
    reservation: 'Reservas',
    vipClub: 'Club VIP',
    events: 'Eventos',
    contact: 'Contacto',
    bookTable: 'Reservar Mesa',
    exploreMenu: 'Explorar Menú',
    goodFoodTag: 'BUENA COMIDA | BUEN MOMENTO',
    heroTitle: 'Comida Deliciosa para Cada Estado de Ánimo',
    heroDesc: 'Una mezcla perfecta de sabor, calidad suprema y ambiente acogedor.',
    freshIngredients: 'Ingredientes Frescos',
    expertChefs: 'Chefs Expertos',
    madeWithLove: 'Hecho con Pasión',
    popularDishes: 'Nuestros Platos Favoritos',
    viewFullMenu: 'Ver Menú Completo',
    specialOffer: 'Oferta Especial',
    discount20: 'Obtén 20% de Descuento en tu Primer Pedido',
    findTable: 'Buscar Mesa',
    cart: 'Carrito',
    checkout: 'Pagar',
    delivery: 'Entrega a Domicilio',
    takeaway: 'Para Llevar',
    dineIn: 'En Sala',
    splitBill: 'Dividir Cuenta',
    requestAssistance: 'Llamar al Camarero',
    requestBill: 'Pedir la Cuenta',
    management: 'Portal Admin'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (k) => k
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const saved = localStorage.getItem('flavoria_lang') as LanguageCode;
    if (saved && ['en', 'bn', 'fr', 'es'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('flavoria_lang', lang);
  };

  const t = (key: string): string => {
    const dict = DICTIONARIES[language] || DICTIONARIES.en;
    return dict[key] || DICTIONARIES.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
