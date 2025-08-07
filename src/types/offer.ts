export interface OfferSection {
  id: string;
  type: 'text' | 'image' | 'pricing' | 'header';
  title: string;
  content: string;
  isVisible: boolean;
  order: number;
}
