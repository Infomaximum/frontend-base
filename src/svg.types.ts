/** Импортировать svg как компонент реакта */
declare module "*.svg" {
  const src: React.FC<React.SVGAttributes<SVGElement>>;
  export default src;
}

/** Импортировать сами svg в base64 */
declare module "*.svg?url" {
  const src: string;
  export default src;
}
declare module "*.cur" {
  const src: string;
  export default src;
}
