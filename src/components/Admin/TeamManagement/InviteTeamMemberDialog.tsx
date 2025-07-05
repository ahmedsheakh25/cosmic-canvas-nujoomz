import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'next-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'editor', 'viewer']),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteTeamMemberDialog({
  open,
  onOpenChange,
}: InviteTeamMemberDialogProps) {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'viewer',
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (values: InviteFormValues) => {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invites'] });
      onOpenChange(false);
      form.reset();
      toast.success(t('team.invite_sent'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: InviteFormValues) {
    inviteMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('team.invite_member')}</DialogTitle>
          <DialogDescription>
            {t('team.invite_description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('team.email')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="colleague@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('team.role')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('team.select_role')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="viewer">
                        {t('roles.viewer')}
                      </SelectItem>
                      <SelectItem value="editor">
                        {t('roles.editor')}
                      </SelectItem>
                      <SelectItem value="manager">
                        {t('roles.manager')}
                      </SelectItem>
                      <SelectItem value="admin">
                        {t('roles.admin')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                loading={inviteMutation.isPending}
              >
                {t('team.send_invite')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 