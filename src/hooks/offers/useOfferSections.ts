import { useState, useCallback } from 'react';
import { OfferSection } from '@/types/offers';

export const useOfferSections = (initialSections: OfferSection[] = []) => {
  const [sections, setSections] = useState<OfferSection[]>(initialSections);
  const [isDragging, setIsDragging] = useState(false);

  const reorderSections = useCallback((dragIndex: number, hoverIndex: number) => {
    setSections(prevSections => {
      const newSections = [...prevSections];
      const draggedSection = newSections[dragIndex];
      
      newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, draggedSection);
      
      // Update order property
      return newSections.map((section, index) => ({
        ...section,
        order: index
      }));
    });
  }, []);

  const addSection = useCallback((type: OfferSection['type'], position?: number) => {
    const newSection: OfferSection = {
      id: `section-${Date.now()}-${Math.random()}`,
      type,
      title: getSectionDefaultTitle(type),
      content: getSectionDefaultContent(type),
      isVisible: true,
      order: position ?? sections.length,
      config: {
        editable: true,
        required: false,
      }
    };

    setSections(prevSections => {
      const newSections = [...prevSections];
      if (position !== undefined) {
        newSections.splice(position, 0, newSection);
        // Update order for subsequent sections
        return newSections.map((section, index) => ({
          ...section,
          order: index
        }));
      }
      return [...newSections, newSection];
    });
  }, [sections.length]);

  const removeSection = useCallback((sectionId: string) => {
    setSections(prevSections => 
      prevSections
        .filter(section => section.id !== sectionId)
        .map((section, index) => ({
          ...section,
          order: index
        }))
    );
  }, []);

  const updateSection = useCallback((sectionId: string, updates: Partial<OfferSection>) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, ...updates }
          : section
      )
    );
  }, []);

  const toggleSectionVisibility = useCallback((sectionId: string) => {
    updateSection(sectionId, { isVisible: !sections.find(s => s.id === sectionId)?.isVisible });
  }, [sections, updateSection]);

  return {
    sections,
    setSections,
    isDragging,
    setIsDragging,
    reorderSections,
    addSection,
    removeSection,
    updateSection,
    toggleSectionVisibility,
  };
};

const getSectionDefaultTitle = (type: OfferSection['type']): string => {
  const titles = {
    cover: 'Försättsblad',
    introduction: 'Introduktion',
    pricing: 'Prissättning',
    terms: 'Villkor',
    signature: 'Signering',
    attachment: 'Bilagor',
    text: 'Textsektion',
    table: 'Tabell',
    image: 'Bild'
  };
  return titles[type] || 'Ny sektion';
};

const getSectionDefaultContent = (type: OfferSection['type']): Record<string, unknown> => {
  switch (type) {
    case 'cover':
      return {
        title: 'Offert',
        subtitle: '',
        companyLogo: '',
        backgroundImage: ''
      };
    case 'introduction':
      return {
        text: 'Vi är glada att presentera denna offert för er.',
        showDate: true,
        showValidUntil: true
      };
    case 'pricing':
      return {
        items: [],
        showDiscount: true,
        showTax: true,
        currency: 'SEK'
      };
    case 'terms':
      return {
        text: 'Allmänna villkor...',
        items: []
      };
    case 'signature':
      return {
        requiredFields: ['name', 'date'],
        instructions: 'Vänligen signera nedan för att acceptera offerten.'
      };
    case 'text':
      return {
        text: '',
        fontSize: 'medium',
        alignment: 'left'
      };
    default:
      return {};
  }
};
