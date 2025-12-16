import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import OmeletButton, {
  ButtonProps as OmeletButtonProps,
} from 'the-omelet-ui/button';

const buttonVariants = cva('', {
  variants: {
    variant: {
      solid: 'bg-primary text-primary-foreground',
      outline:
        'border-gray-600 text-gray-600 bg-transparent border hover:bg-gray-100',
      ghost: 'bg-transparent',
    },
    icon: {
      true: 'flex items-center justify-center w-10 h-10',
    },
    defaultVariants: {
      variant: 'solid',
    },
  },
});

interface ButtonProps extends OmeletButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  isIcon?: boolean;
}

export const Button = ({
  children,
  className,
  variant = 'solid',
  isIcon = false,
  ...props
}: ButtonProps) => {
  return (
    <OmeletButton
      {...props}
      id="button"
      className={cn(buttonVariants({ variant, icon: isIcon }), className)}
    >
      {children}
    </OmeletButton>
  );
};
