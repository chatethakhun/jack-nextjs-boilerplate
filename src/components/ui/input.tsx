import OTextInput, { TextInputProps } from 'the-omelet-ui/textInput';
export const TextInput = ({ className, ...props }: TextInputProps) => (
  <OTextInput {...props} className="border-gray-300" />
);
