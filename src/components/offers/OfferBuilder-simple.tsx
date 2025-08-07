'use client';

import React from 'react';

interface OfferBuilderProps {
  onSave?: (offer: any) => void;
  onSend?: (offer: any) => void;
}

const OfferBuilder: React.FC<OfferBuilderProps> = ({
  onSave,
  onSend,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Offertbyggare
        </h1>
        <div className="bg-white rounded-lg border p-6">
          <p className="text-gray-600">
            Offertbyggaren kommer snart tillbaka med alla funktioner...
          </p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => onSave?.({})}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Spara
            </button>
            <button
              onClick={() => onSend?.({})}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Skicka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferBuilder;
