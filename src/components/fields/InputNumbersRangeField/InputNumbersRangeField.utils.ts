export const normalizeRange = <T>([begin, end]: [T, T]): [T, T] =>
  Number(begin) > Number(end) ? [begin, begin] : [begin, end];
