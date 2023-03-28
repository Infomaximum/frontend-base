/** Импортировать svg как компонент реакта */
declare module "*.svg" {
  const srcSvg: React.FC<React.SVGAttributes<SVGElement>>;
  export default srcSvg;
}

/** Импортировать сами svg в base64 */
declare module "*.svg?url" {
  const srcSvgUrl: string;
  export default srcSvgUrl;
}
declare module "*.cur" {
  const srcCur: string;
  export default srcCur;
}
