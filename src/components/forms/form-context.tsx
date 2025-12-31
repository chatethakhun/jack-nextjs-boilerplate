'use client';

import { createContext, useContext, useId, forwardRef, useMemo } from 'react';
import {
  useForm,
  useFormContext,
  useFormState,
  FormProvider,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  UseFormProps,
  Controller,
  ControllerProps,
  FieldPath,
  FieldError,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodType } from 'zod';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import React from 'react';

// ============================================================================
// Form Context
// ============================================================================

interface FormFieldContextValue {
  id: string;
  name: string;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const { control } = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField must be used within a Form.Field');
  }

  // Use useFormState to properly subscribe to form state changes
  const { errors } = useFormState({ control, name: fieldContext.name });

  // Get nested error using the field name (supports dot notation like "user.name")
  const error = fieldContext.name
    .split('.')
    .reduce<
      FieldError | undefined
    >((err, key) => (err as any)?.[key], errors as any);

  return {
    id: fieldContext.id,
    name: fieldContext.name,
    error,
    formItemId: `${fieldContext.id}-form-item`,
    formDescriptionId: `${fieldContext.id}-form-description`,
    formMessageId: `${fieldContext.id}-form-message`,
  };
}

// ============================================================================
// Form Root
// ============================================================================

interface FormRootProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
}

function FormRoot<TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormRootProps<TFieldValues>) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 🔑 Stop event from bubbling to parent forms
    e.stopPropagation();
    form.handleSubmit(onSubmit)(e);
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={className} noValidate {...props}>
        {children}
      </form>
    </FormProvider>
  );
}

// ============================================================================
// Form Field
// ============================================================================

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  children: React.ReactNode;
  className?: string;
}

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, children, className }: FormFieldProps<TFieldValues, TName>) {
  const id = useId();

  const contextValue = useMemo(
    () => ({
      id,
      name,
    }),
    [id, name]
  );

  return (
    <FormFieldContext.Provider value={contextValue}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </FormFieldContext.Provider>
  );
}

// ============================================================================
// Form Label
// ============================================================================

const labelVariants = cva('block font-semibold transition-colors', {
  variants: {
    variant: {
      default: 'text-gundam-gray-800',
      error: 'text-gundam-red',
      muted: 'text-gundam-gray-500',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

interface FormLabelProps
  extends
    React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
}

const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  (
    { className, variant, size, required, optional, children, ...props },
    ref
  ) => {
    const { formItemId, error } = useFormField();

    return (
      <label
        ref={ref}
        htmlFor={formItemId}
        className={cn(
          labelVariants({ variant: error ? 'error' : variant, size }),
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-gundam-red ml-0.5">*</span>}
        {optional && (
          <span className="font-normal text-gundam-gray-500 ml-1">
            (optional)
          </span>
        )}
      </label>
    );
  }
);

FormLabel.displayName = 'FormLabel';

// ============================================================================
// Form Control (Uncontrolled - uses register)
// ============================================================================

interface FormControlProps {
  children: React.ReactElement;
}

function FormControl({ children }: FormControlProps) {
  const { formItemId, formDescriptionId, formMessageId, error, name } =
    useFormField();
  const { register } = useFormContext();

  // Clone element and inject props
  const childProps = {
    id: formItemId,
    'aria-describedby': error
      ? `${formDescriptionId} ${formMessageId}`
      : formDescriptionId,
    'aria-invalid': !!error,
    variant: error ? 'error' : 'default',
    ...register(name),
  };

  return <>{React.cloneElement(children, childProps)}</>;
}

// ============================================================================
// Form Control (Controlled - for complex inputs)
// ============================================================================

interface FormControlledProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  render: ControllerProps<TFieldValues, TName>['render'];
}

function FormControlled<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ render }: FormControlledProps<TFieldValues, TName>) {
  const { name, formItemId } = useFormField();
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name as TName}
      control={control}
      render={({ field, fieldState, formState }) =>
        render({
          field: {
            ...field,
            // @ts-ignore - id is valid for input elements
            id: formItemId,
          },
          fieldState,
          formState,
        })
      }
    />
  );
}

// ============================================================================
// Form Description
// ============================================================================

const FormDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-xs text-gundam-gray-500', className)}
      {...props}
    />
  );
});

FormDescription.displayName = 'FormDescription';

// ============================================================================
// Form Error
// ============================================================================

const errorVariants = cva('flex items-center gap-1', {
  variants: {
    variant: {
      default: 'text-gundam-red',
      warning: 'text-gundam-yellow',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

interface FormErrorProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof errorVariants> {
  showIcon?: boolean;
}

const FormError = forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, variant, size, showIcon = true, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const message = error?.message || children;

    if (!message) return null;

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn(errorVariants({ variant, size }), className)}
        {...props}
      >
        {showIcon && (
          <svg
            className="w-4 h-4 hrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {message}
      </p>
    );
  }
);

FormError.displayName = 'FormError';

// ============================================================================
// Form Submit
// ============================================================================

interface FormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loadingText?: string;
  isLoading?: boolean;
}

const FormSubmit = forwardRef<HTMLButtonElement, FormSubmitProps>(
  (
    { className, loadingText, children, disabled, isLoading, ...props },
    ref
  ) => {
    const { control } = useFormContext();
    const { isSubmitting } = useFormState({ control });

    return (
      <button
        ref={ref}
        type="submit"
        disabled={isSubmitting || disabled}
        className={cn('w-full', className)}
        {...props}
      >
        {isLoading ? loadingText : children}
      </button>
    );
  }
);

FormSubmit.displayName = 'FormSubmit';

// ============================================================================
// useZodForm Hook
// ============================================================================

interface UseZodFormProps<TFieldValues extends FieldValues> extends Omit<
  UseFormProps<TFieldValues>,
  'resolver'
> {
  schema: ZodType<TFieldValues>;
}

function useZodForm<TFieldValues extends FieldValues>({
  schema,
  ...props
}: UseZodFormProps<TFieldValues>) {
  return useForm<TFieldValues>({
    resolver: zodResolver(schema as any),
    ...props,
  });
}

// ============================================================================
// Export
// ============================================================================

export const Form = Object.assign(FormRoot, {
  Field: FormField,
  Label: FormLabel,
  Control: FormControl,
  Controlled: FormControlled,
  Description: FormDescription,
  Error: FormError,
  Submit: FormSubmit,
});

export { useZodForm, useFormField };
export type { FormRootProps, FormFieldProps, FormLabelProps, FormSubmitProps };
