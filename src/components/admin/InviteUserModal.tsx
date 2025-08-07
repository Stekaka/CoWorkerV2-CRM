'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Mail, User, Settings } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { CompanySettings, UserFormData } from '@/types/user-management';
import { ModuleName, UserRole } from '@/types/user-management';
import { MODULE_DEFINITIONS, getAvailableModulesForPlan } from '@/config/modules';

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company: CompanySettings | null;
}

export function InviteUserModal({ open, onClose, onSuccess, company }: InviteUserModalProps) {
  const { inviteUser } = useUserManagement();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'user',
    allowed_modules: []
  });

  const availableModules = company ? getAvailableModulesForPlan(company.plan) : [];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validering
      if (!formData.name.trim()) {
        throw new Error('Namn krävs');
      }
      if (!formData.email.trim()) {
        throw new Error('E-post krävs');
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error('Ogiltig e-postadress');
      }
      
      const success = await inviteUser(formData);
      
      if (success) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: '',
          email: '',
          role: 'user',
          allowed_modules: []
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleToggle = (moduleId: ModuleName) => {
    setFormData(prev => ({
      ...prev,
      allowed_modules: prev.allowed_modules.includes(moduleId)
        ? prev.allowed_modules.filter(m => m !== moduleId)
        : [...prev.allowed_modules, moduleId]
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
    
    // Om admin väljs, ge tillgång till alla moduler
    if (role === 'admin') {
      setFormData(prev => ({
        ...prev,
        allowed_modules: availableModules.map(m => m.id)
      }));
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Fullständig tillgång till alla funktioner och inställningar';
      case 'manager':
        return 'Kan hantera team och se rapporter, begränsad administrativ tillgång';
      case 'user':
        return 'Standard användare med tillgång till tilldelade moduler';
      case 'viewer':
        return 'Kan endast visa data, ingen redigeringsrätt';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Bjud in ny användare
          </DialogTitle>
          <DialogDescription>
            Lägg till en ny användare till {company?.name} och välj vilka moduler de ska ha tillgång till.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Grundläggande information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Fullständigt namn *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">E-postadress *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Roll */}
          <div className="space-y-3">
            <Label>Användarroll *</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Välj roll" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Administratör
                  </div>
                </SelectItem>
                <SelectItem value="manager">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Manager
                  </div>
                </SelectItem>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Användare
                  </div>
                </SelectItem>
                <SelectItem value="viewer">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Visare
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {getRoleDescription(formData.role)}
            </p>
          </div>

          {/* Moduler */}
          <div className="space-y-3">
            <Label>Tillgängliga moduler</Label>
            <p className="text-sm text-gray-600">
              Välj vilka moduler användaren ska ha tillgång till:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-lg p-3">
              {availableModules.map((moduleConfig) => {
                const isSelected = formData.allowed_modules.includes(moduleConfig.id);
                const isBaseModule = moduleConfig.is_base;
                
                return (
                  <div
                    key={moduleConfig.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isBaseModule ? 'opacity-75' : ''}`}
                    onClick={() => !isBaseModule && handleModuleToggle(moduleConfig.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{moduleConfig.name}</h4>
                          {isBaseModule && (
                            <Badge variant="outline" className="text-xs">
                              Bas
                            </Badge>
                          )}
                          {moduleConfig.price_per_month > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {moduleConfig.price_per_month} kr/mån
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {moduleConfig.description}
                        </p>
                      </div>
                      
                      {(isSelected || isBaseModule) && (
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {formData.role === 'admin' && (
              <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                💡 Administratörer får automatiskt tillgång till alla moduler
              </p>
            )}
          </div>

          {/* Valda moduler */}
          {formData.allowed_modules.length > 0 && (
            <div>
              <Label>Valda moduler ({formData.allowed_modules.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.allowed_modules.map((moduleId) => {
                  const moduleConfig = MODULE_DEFINITIONS.find(m => m.id === moduleId);
                  return (
                    <Badge
                      key={moduleId}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => handleModuleToggle(moduleId)}
                    >
                      {moduleConfig?.name}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.name || !formData.email}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Skickar inbjudan...' : 'Skicka inbjudan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
