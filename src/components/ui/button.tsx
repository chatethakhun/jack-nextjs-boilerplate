import OmeletButton, { ButtonProps } from 'the-omelet-ui/button';

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <OmeletButton variant="solid" color="primary" {...props}>
      {children}
    </OmeletButton>
  );
};
