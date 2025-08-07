'use client';

import React, { useState, useRef } from 'react';
// import { useDrag, useDrop } from 'react-dnd';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  Settings,
  FileText,
  Image,
  Calculator,
  FileSignature,
  Paperclip,
  AlignLeft
} from 'lucide-react';
import { OfferSection } from '@/types/offers';

interface DragItem {
  id: string;
  type: string;
  index: number;
}

interface OfferSectionCardProps {
  section: OfferSection;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onUpdate: (sectionId: string, updates: Partial<OfferSection>) => void;
  onRemove: (sectionId: string) => void;
  onToggleVisibility: (sectionId: string) => void;
  isPreviewMode?: boolean;
}

export const OfferSectionCard: React.FC<OfferSectionCardProps> = ({
  section,
  index,
  onMove,
  onUpdate,
  onRemove,
  onToggleVisibility,
  isPreviewMode = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Temporary placeholder for drag functionality
  const isDragging = false;

  // Simplified drag handle (can be enhanced with react-dnd later)
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', section.id);
  };

  const getSectionIcon = (type: OfferSection['type']) => {
    const icons = {
      cover: FileText,
      introduction: AlignLeft,
      pricing: Calculator,
      terms: FileText,
      signature: FileSignature,
      attachment: Paperclip,
      text: AlignLeft,
      table: Calculator,
      image: Image,
    };
    const Icon = icons[type] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdate(section.id, { title: newTitle });
  };

  if (isPreviewMode) {
    return (
      <div className={`w-full ${!section.isVisible ? 'hidden' : ''}`}>
        <SectionContent section={section} />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`
        group relative bg-white rounded-xl border border-gray-200 
        transition-all duration-200 hover:border-gray-300 hover:shadow-md
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : 'opacity-100'}
        ${!section.isVisible ? 'opacity-60' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle */}
      <div
        className={`
          absolute -left-3 top-1/2 transform -translate-y-1/2 
          w-6 h-8 bg-gray-100 rounded-md border border-gray-200
          flex items-center justify-center cursor-grab active:cursor-grabbing
          transition-all duration-200
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
          hover:bg-gray-200 hover:border-gray-300
        `}
        title="Dra för att flytta sektion"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
            {getSectionIcon(section.type)}
          </div>
          
          {isEditing ? (
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditing(false);
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              autoFocus
            />
          ) : (
            <h3 
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >
              {section.title}
            </h3>
          )}
          
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {section.type}
          </span>
        </div>

        <div className={`
          flex items-center space-x-2 transition-all duration-200
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <button
            onClick={() => onToggleVisibility(section.id)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={section.isVisible ? 'Dölj sektion' : 'Visa sektion'}
          >
            {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Inställningar"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onRemove(section.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Ta bort sektion"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section Content Preview */}
      <div className="p-4">
        <SectionContent section={section} isPreview />
      </div>

      {/* Edit Overlay */}
      {!isPreviewMode && (
        <div className={`
          absolute inset-0 bg-blue-500/5 rounded-xl 
          flex items-center justify-center
          transition-all duration-200
          ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="w-4 h-4" />
            <span>Redigera innehåll</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Section Content Component
const SectionContent: React.FC<{
  section: OfferSection;
  isPreview?: boolean;
}> = ({ section, isPreview = false }) => {
  const previewClass = isPreview ? 'text-sm text-gray-600' : '';

  switch (section.type) {
    case 'cover':
      return (
        <div className={`text-center py-8 ${previewClass}`}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {(section.content.title as string) || 'Offert'}
          </h1>
          <p className="text-lg text-gray-600">
            {(section.content.subtitle as string) || 'Klicka för att redigera'}
          </p>
        </div>
      );

    case 'introduction':
      return (
        <div className={previewClass}>
          <p className="text-gray-700 leading-relaxed">
            {(section.content.text as string) || 'Klicka för att lägga till introduktionstext...'}
          </p>
        </div>
      );

    case 'pricing':
      return (
        <div className={`space-y-2 ${previewClass}`}>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Tjänst/Produkt</span>
            <span className="font-medium">Pris</span>
          </div>
          <div className="text-center text-gray-500 py-4">
            Inga priser tillagda ännu
          </div>
        </div>
      );

    case 'terms':
      return (
        <div className={previewClass}>
          <p className="text-gray-700">
            {(section.content.text as string) || 'Klicka för att lägga till villkor...'}
          </p>
        </div>
      );

    case 'signature':
      return (
        <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${previewClass}`}>
          <FileSignature className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Signeringsområde</p>
        </div>
      );

    default:
      return (
        <div className={`text-center py-4 text-gray-500 ${previewClass}`}>
          <Edit3 className="w-6 h-6 mx-auto mb-2" />
          <p>Klicka för att redigera innehåll</p>
        </div>
      );
  }
};
