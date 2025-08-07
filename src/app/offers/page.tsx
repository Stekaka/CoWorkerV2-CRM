'use client';

import React from 'react';
import { OfferBuilder } from '@/components/offers/OfferBuilder';
import { Offer } from '@/types/offers';

export default function OffersPage() {
  const handleSave = async (offer: Partial<Offer>) => {
    console.log('Sparar offert:', offer);
    // Här skulle du anropa ditt API för att spara offerten
  };

  const handleSend = async (offer: Partial<Offer>) => {
    console.log('Skickar offert:', offer);
    // Här skulle du anropa ditt API för att skicka offerten
  };

  return (
    <div>
      <OfferBuilder 
        onSave={handleSave}
        onSend={handleSend}
      />
    </div>
  );
}
