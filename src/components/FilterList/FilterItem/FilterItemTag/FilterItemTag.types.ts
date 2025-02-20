export interface IFilterItemTagProps {
  caption: string;
  children?: React.ReactNode;
  disabled: boolean;
  handleEditFilter: () => void;
  handleRemoveFilter: () => void;
  withOverflow?: boolean;
  closeIconTestId?: string;
}
