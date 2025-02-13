import { ESpaceSize } from "../../../decorators/contexts/SpaceSizeContext";

export const addEntityButtonStyle = {
  padding: 0,
};

export const buttonDescriptionWrapperStyle = {
  display: "flex",
  alignItems: "center",
  height: "22px",
};

export const addButtonWrapperStyle = {
  display: "flex",
  alignItems: "center",
  marginRight: "6px",
  lineHeight: "20px",
};

export const addButtonStyle = {
  width: "1em",
};

export const wrappedArrayFieldStyle = {
  ".ant-form-item": {
    marginBottom: 0,
  },
};

export const getRowsContainerStyle = (spaceSize: string) => (theme: TTheme) => ({
  display: "flex",
  flexDirection: "column" as const,
  gap: spaceSize === ESpaceSize.default ? 8 : theme.smallSpace,
});
