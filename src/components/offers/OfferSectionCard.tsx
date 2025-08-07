'use client';

import React, { useState, useRef } from 'react';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { OfferSection } from '@/types/offer';

export interface OfferSectionCardProps {
  section: OfferSection;
  onUpdate: (id: string, updates: Partial<OfferSection>) => void;
  onDelete: (id: string) => void;
  icon: React.ReactNode;
}

export const OfferSectionCard: React.FC<OfferSectionCardProps> = ({
  section,
  onUpdate,
  onDelete,
  icon
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(section.title);
  const [localContent, setLocalContent] = useState(section.content);
  const ref = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', section.id);
  };

  const handleSave = () => {
    onUpdate(section.id, {
      title: localTitle,
      content: localContent
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalTitle(section.title);
    setLocalContent(section.content);
    setIsEditing(false);
  };

  const toggleVisibility = () => {
    onUpdate(section.id, { isVisible: !section.isVisible });
  };

  const getSectionPreview = () => {
    switch (section.type) {
      case 'header':
        return (
          <div>
            <h3 className="text-lg font-semibold">{section.title}</h3>
          </div>
        );
      case 'text':
        return (
          <div>
            <h4 className="font-medium mb-1">{section.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-3">{section.content}</p>
          </div>
        );
      case 'image':
        return (
          <div>
            <h4 className="font-medium mb-1">{section.title}</h4>
            <div className="bg-gray-100 p-2 rounded text-center">
              <Image className="h-8 w-8 mx-auto text-gray-400" />
              <p className="text-xs text-gray-500 mt-1">{section.content}</p>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div>
            <h4 className="font-medium mb-1">{section.title}</h4>
            <div className="bg-blue-50 p-2 rounded">
              <pre className="text-xs whitespace-pre-wrap">{section.content}</pre>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <p>Okänd sektionstyp</p>
          </div>
        );
    }
  };

  if (isEditing) {
    return (
      <Card className="border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <Input
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                className="font-medium"
                placeholder="Sektionens titel"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button onClick={handleSave} size="sm">
                Spara
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Avbryt
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            rows={section.type === 'text' ? 6 : 3}
            placeholder={`Skriv innehåll för ${section.type}...`}
            className="mb-3"
          />
          {section.type === 'pricing' && (
            <p className="text-xs text-gray-500">
              Tips: Använd format som &quot;Pris: 1000 kr\nBeskrivning: Beskrivning av tjänsten&quot;
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      ref={ref}
      className={`group hover:shadow-md transition-shadow ${
        !section.isVisible ? 'opacity-50' : ''
      }`}
      draggable
      onDragStart={handleDragStart}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
            {icon}
            <span className="font-medium">{section.title}</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {section.type}
            </span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={toggleVisibility}
              variant="ghost"
              size="sm"
            >
              {section.isVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onDelete(section.id)}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {section.content ? (
          getSectionPreview()
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Edit3 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Klicka för att redigera innehåll</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
