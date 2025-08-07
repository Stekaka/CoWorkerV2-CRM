export interface OfferSection {
  id: string;
  type: 'cover' | 'introduction' | 'pricing' | 'terms' | 'signature' | 'attachment' | 'text' | 'table' | 'image';
  title: string;
  content: Record<string, unknown>;
  isVisible: boolean;
  order: number;
  config: {
    editable: boolean;
    required: boolean;
  };
}

export interface PricingItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  total: number;
  unit?: string;
}

export interface Offer {
  id: string;
  title: string;
  sections: OfferSection[];
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  validUntil?: Date;
  clientId?: string;
  companyId: string;
  createdBy: string;
  totalAmount?: number;
  currency?: string;
}

export interface OfferTemplate {
  id: string;
  name: string;
  description?: string;
  sections: OfferSection[];
  isDefault: boolean;
  category?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
