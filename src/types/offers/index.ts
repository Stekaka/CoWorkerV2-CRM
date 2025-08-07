export type OfferStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected' | 'expired';

export type SectionType = 
  | 'cover' 
  | 'introduction' 
  | 'pricing' 
  | 'terms' 
  | 'signature' 
  | 'attachment'
  | 'text'
  | 'table'
  | 'image';

export interface OfferSection {
  id: string;
  type: SectionType;
  title: string;
  content: Record<string, unknown>; // Flexible content based on section type
  isVisible: boolean;
  order: number;
  config?: {
    editable?: boolean;
    required?: boolean;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export interface PricingItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

export interface OfferTemplate {
  id: string;
  name: string;
  description?: string;
  sections: OfferSection[];
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: string;
  title: string;
  leadId?: string;
  status: OfferStatus;
  sections: OfferSection[];
  templateId?: string;
  totalAmount: number;
  validUntil?: Date;
  sentAt?: Date;
  signedAt?: Date;
  rejectedAt?: Date;
  customerEmail?: string;
  customerName?: string;
  companyId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DragItem {
  id: string;
  type: string;
  index: number;
}
