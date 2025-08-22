export interface IInlineTagProps {
  getName(): string | undefined;
  getInnerName(): string;
  color: string | undefined;
}

export interface IInlineTagsProps {
  tags: IInlineTagProps[];
  measuredWidth: number;
}
