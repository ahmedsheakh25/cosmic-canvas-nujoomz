import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { MoreVertical, UserPlus } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { InviteTeamMemberDialog } from './InviteTeamMemberDialog';

interface TeamMember {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email: string;
  roles: string[];
}

export function TeamMemberList() {
  const { t } = useTranslation('admin');
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          full_name,
          avatar_url,
          auth.users!inner(email),
          user_roles(role)
        `);

      if (profilesError) throw profilesError;

      return profiles.map((profile: any) => ({
        id: profile.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        email: profile.users.email,
        roles: profile.user_roles.map((r: any) => r.role)
      }));
    }
  });

  const { data: pendingInvites } = useQuery({
    queryKey: ['team-invites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_invites')
        .select('*')
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('team.title')}</CardTitle>
              <CardDescription>
                {t('team.description')}
              </CardDescription>
            </div>
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              {t('team.invite')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatar_url || undefined} />
                    <AvatarFallback>
                      {member.full_name?.charAt(0) || member.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.full_name}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {member.roles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {t(`roles.${role}`)}
                    </Badge>
                  ))}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('team.actions')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        {t('team.edit_roles')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        {t('team.remove')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {pendingInvites?.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between py-2 opacity-50"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{invite.email}</div>
                    <div className="text-sm text-gray-500">
                      {t('team.pending_invite')}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">
                  {t(`roles.${invite.role}`)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <InviteTeamMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </>
  );
} 