export interface ITagProps {
  getName(): string | undefined;
  getInnerName(): string;
  color: string | undefined;
}

export interface IInlineTagsProps {
  tags: ITagProps[];
  measuredWidth: number;
}
