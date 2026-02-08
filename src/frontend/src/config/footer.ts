/**
 * Footer configuration module containing exact copy for brand tagline,
 * Quick Links navigation, and copyright text
 */

export const BRAND_TAGLINE = 'Fresh Veg Momos Delivered Fast – Quality You Can Taste!';

export const COPYRIGHT_TEXT = '© 2026 Bro Bro Foods. All Rights Reserved.';

export interface QuickLink {
  label: string;
  sectionId: string;
}

export const QUICK_LINKS: QuickLink[] = [
  { label: 'About Us', sectionId: 'about' },
  { label: 'Menu', sectionId: 'menu' },
  { label: 'Order Now', sectionId: 'order-now' },
  { label: 'Contact Us', sectionId: 'contact' },
];
