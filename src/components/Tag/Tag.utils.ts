import type { TagProps } from "@infomaximum/ui-kit";

// todo: Удалить то что нужно удалить после задач серверных миграций PT-16089
/** Функция приведения серверных значений цветов тега к объекту конфигурации компонента Tag */
export function getTagPropsByColor(color?: string): {
  color: TagProps["color"];
  type?: TagProps["type"];
} {
  switch (color) {
    case "red":
      return { color: "red" };
    case "orange":
      return { color: "orange" };
    case "yellow":
      return { color: "yellow" };
    case "green":
      return { color: "green" };
    case "cyan":
      return { color: "cyan" };
    case "blue":
      return { color: "blue" };
    case "purple":
      return { color: "purple" };
    case "magenta":
      return { color: "magenta" };
    case "neutral":
      return { color: "neutral" };

    // Удалить после реализации миграции на сервере
    // ==========================================START
    case "pink":
      return { color: "magenta" };
    case "geekblue":
      return { color: "blue" };
    case "volcano":
      return { color: "orange" };
    case "lime":
      return { color: "green" };
    case "grey":
      return { color: "neutral" };
    // ==========================================END

    // FILLED
    case "redFilled":
      return { color: "red", type: "filled" };
    case "orangeFilled":
      return { color: "orange", type: "filled" };
    case "yellowFilled":
      return { color: "yellow", type: "filled" };
    case "greenFilled":
      return { color: "green", type: "filled" };
    case "cyanFilled":
      return { color: "cyan", type: "filled" };
    case "blueFilled":
      return { color: "blue", type: "filled" };
    case "purpleFilled":
      return { color: "purple", type: "filled" };
    case "magentaFilled":
      return { color: "magenta", type: "filled" };
    case "neutralFilled":
      return { color: "neutral", type: "filled" };

    // Удалить после реализации миграции на сервере
    // ==========================================START
    case "pinkInv":
      return { color: "magenta", type: "filled" };
    case "geekblueInv":
      return { color: "blue", type: "filled" };
    case "volcanoInv":
      return { color: "orange", type: "filled" };
    case "limeInv":
      return { color: "green", type: "filled" };
    case "greyInv":
      return { color: "neutral", type: "filled" };
    case "redInv":
      return { color: "red", type: "filled" };
    case "orangeInv":
      return { color: "orange", type: "filled" };
    case "yellowInv":
      return { color: "yellow", type: "filled" };
    case "greenInv":
      return { color: "green", type: "filled" };
    case "cyanInv":
      return { color: "cyan", type: "filled" };
    case "blueInv":
      return { color: "blue", type: "filled" };
    case "purpleInv":
      return { color: "purple", type: "filled" };
    // ==========================================END

    default:
      return { color: "neutral" };
  }
}
