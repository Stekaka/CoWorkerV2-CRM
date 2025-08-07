'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  MoreVertical, 
  Crown, 
  Settings, 
  Mail, 
  Shield,
  UserCheck,
  UserX,
  Edit,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserProfile } from '@/types/user-management';
import { InviteUserModal } from './InviteUserModal';
import { EditUserModal } from './EditUserModal';
import { formatDate } from '@/lib/utils';

export function UserManagement() {
  const {
    users,
    company,
    loading,
    error,
    removeUser,
    updateUserRole,
    refreshData
  } = useUserManagement();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const getRoleIcon = (role: UserProfile['role']) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'manager': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'user': return <UserCheck className="w-4 h-4 text-green-500" />;
      case 'viewer': return <UserX className="w-4 h-4 text-gray-500" />;
      default: return <UserCheck className="w-4 h-4 text-green-500" />;
    }
  };

  const getRoleBadgeColor = (role: UserProfile['role']) => {
    switch (role) {
      case 'admin': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'user': return 'bg-green-100 text-green-800 border-green-300';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Är du säker på att du vill ta bort denna användare?')) {
      await removeUser(userId);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: UserProfile['role']) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await updateUserRole(userId, newRole);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Fel: {error}</p>
          <Button onClick={refreshData} className="mt-2" variant="outline">
            Försök igen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Användarhantering</h1>
          <p className="text-gray-600 mt-1">
            Hantera användare och deras behörigheter för {company?.name}
          </p>
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Bjud in användare
        </Button>
      </div>

      {/* Company overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Företagsöversikt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-blue-800">Aktiva användare</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {company?.max_users === -1 ? '∞' : company?.max_users}
              </div>
              <div className="text-sm text-green-800">Max användare</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 capitalize">
                {company?.plan}
              </div>
              <div className="text-sm text-purple-800">Nuvarande plan</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-sm text-orange-800">Administratörer</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users list */}
      <Card>
        <CardHeader>
          <CardTitle>Användare</CardTitle>
          <CardDescription>
            Hantera användare och deras roller för ditt företag
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      {getRoleIcon(user.role)}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={getRoleBadgeColor(user.role)}
                      >
                        {user.role}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {user.allowed_modules.length} moduler
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm text-gray-900">
                      Senast aktiv: {user.last_login ? formatDate(user.last_login) : 'Aldrig'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Medlem sedan {formatDate(user.created_at)}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Åtgärder</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Redigera moduler
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => handleToggleRole(user.id, user.role)}>
                        <Settings className="w-4 h-4 mr-2" />
                        {user.role === 'admin' ? 'Ta bort admin' : 'Gör till admin'}
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Skicka inbjudan igen
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Ta bort användare
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Inga användare hittades</p>
                <Button 
                  onClick={() => setShowInviteModal(true)} 
                  className="mt-4"
                  variant="outline"
                >
                  Bjud in första användaren
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modaler */}
      {showInviteModal && (
        <InviteUserModal
          open={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onSuccess={refreshData}
          company={company}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
}
