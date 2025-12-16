'use client';
import { signIn } from 'next-auth/react';
import { SignInFormData, signInSchema } from '@/schema/sign-in.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { TextInput } from '../ui/input';
import { Button } from '../ui/button';

export const UserForm = () => {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const signMutation = useMutation({
    mutationFn: async (data: SignInFormData) => {
      await signIn('credentials', {
        email: data.username,
        password: data.password,
      });
    },
  });

  const onSubmit = (data: SignInFormData) => {
    signMutation.mutate(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <TextInput
              {...field}
              id="username"
              placeholder="abc"
              error={error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <TextInput
              {...field}
              id="password"
              placeholder="******"
              error={error?.message}
            />
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={signMutation.isPending}>
          {signMutation.isPending ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </Button>
      </form>
    </FormProvider>
  );
};
