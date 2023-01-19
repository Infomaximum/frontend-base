export interface IClipboardIconProps {
  /** текст который будет скопирован в буфер обмена */
  text: string;
  /** Колбек в котором можно обработать копирование и добавить сайд эффекты */
  onClick?(text: string): void;
}
