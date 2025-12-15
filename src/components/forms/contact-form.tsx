'use client';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';

import { TextInput } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ContactFormData, contactSchema } from '@/schema/contact.schema';

export function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: ContactFormData) {
    // Handle form submission
    console.log(values);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <TextInput
              label="Name"
              id="name"
              {...field}
              error={error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <TextInput
              label="Email"
              id="email"
              {...field}
              error={error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="message"
          render={({ field, fieldState: { error } }) => (
            <Textarea
              label="Message"
              id="message"
              {...field}
              error={error?.message}
            />
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
