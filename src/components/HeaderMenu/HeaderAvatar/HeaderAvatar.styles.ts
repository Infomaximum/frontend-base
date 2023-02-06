import type { TAvatarColorConfig } from "./HeaderAvatar.types";

export const getColorConfigList = (theme: TTheme): TAvatarColorConfig[] => [
  /** --------------------------------- Оттенки 1 уровня -------------------------------- **/
  {
    letterColor: theme.grey1Color,
    backgroundColor: theme.azure2Color,
  },
  {
    letterColor: theme.grey1Color,
    backgroundColor: theme.volcano7Color,
  },
  {
    letterColor: theme.grey1Color,
    backgroundColor: theme.orange6Color,
  },
  {
    letterColor: theme.grey1Color,
    backgroundColor: theme.lime7Color,
  },
  {
    letterColor: theme.grey1Color,
    backgroundColor: theme.green6Color,
  },
  {
    letterColor: theme.grey1Color,
    backgroundColor: theme.cyan7Color,
  },
  {
    letterColor: theme.grey1Color,
    backgroundColor: theme.geekBlue6Color,
  },
  {
    letterColor: theme.grey1Color,
    backgroundColor: theme.purple5Color,
  },
  {
    letterColor: theme.grey1Color,
    backgroundColor: theme.magenta5Color,
  },
  {
    letterColor: theme.grey1Color,
    backgroundColor: theme.red6Color,
  },
  {
    letterColor: theme.grey1Color,
    backgroundColor: theme.blue6Color,
  },
];

export const getIconAvatarStyle = (
  theme: TTheme,
  avatarColorConfig: TAvatarColorConfig
) => ({
  color: avatarColorConfig.letterColor,
  backgroundColor: avatarColorConfig.backgroundColor,
  fontSize: `${theme.h5FontSize}px`,
});
