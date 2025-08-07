'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Settings } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserProfile } from '@/types/user-management';
import { ModuleName } from '@/types/user-management';
import { MODULE_DEFINITIONS } from '@/config/modules';

interface EditUserModalProps {
  user: UserProfile;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditUserModal({ user, open, onClose, onSuccess }: EditUserModalProps) {
  const { updateUserModules } = useUserManagement();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<ModuleName[]>(user.allowed_modules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const success = await updateUserModules(user.id, selectedModules);
      
      if (success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleToggle = (moduleId: ModuleName) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(m => m !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Redigera moduler för {user.name}
          </DialogTitle>
          <DialogDescription>
            Välj vilka moduler {user.name} ska ha tillgång till.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Användarinfo */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Moduler */}
          <div className="space-y-3">
            <Label>Tillgängliga moduler</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-lg p-3">
              {MODULE_DEFINITIONS.map((moduleConfig) => {
                const isSelected = selectedModules.includes(moduleConfig.id);
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

            {user.role === 'admin' && (
              <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                💡 Administratörer får automatiskt tillgång till alla moduler
              </p>
            )}
          </div>

          {/* Valda moduler */}
          {selectedModules.length > 0 && (
            <div>
              <Label>Valda moduler ({selectedModules.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedModules.map((moduleId) => {
                  const moduleConfig = MODULE_DEFINITIONS.find(m => m.id === moduleId);
                  const isBaseModule = moduleConfig?.is_base;
                  
                  return (
                    <Badge
                      key={moduleId}
                      variant="secondary"
                      className={`${!isBaseModule ? 'cursor-pointer hover:bg-red-100' : 'opacity-75'}`}
                      onClick={() => !isBaseModule && handleModuleToggle(moduleId)}
                    >
                      {moduleConfig?.name}
                      {!isBaseModule && <X className="w-3 h-3 ml-1" />}
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
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Sparar...' : 'Spara ändringar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
