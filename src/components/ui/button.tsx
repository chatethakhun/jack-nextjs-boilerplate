import OmeletButton, { ButtonProps } from 'the-omelet-ui/button';

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <OmeletButton {...props} variant="solid" color="primary" className="w-full">
      {children}
    </OmeletButton>
  );
};
