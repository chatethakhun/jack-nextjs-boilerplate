import { cn } from '@/lib/utils';
import OTextInput, { TextInputProps } from 'the-omelet-ui/textInput';
export const TextInput = ({ className, ...props }: TextInputProps) => (
  <OTextInput {...props} className={cn('border-gray-300', className)} />
);
