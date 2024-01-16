export const getTextWidth = (() => {
  const context = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;

  return (text: string, fontSize: number) => {
    context.font = `${fontSize}px 'Roboto'`;

    return context.measureText(text).width;
  };
})();
