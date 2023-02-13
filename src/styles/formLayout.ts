/**
 * Разметка для Form
 */

// ------------------------------------TYPE S----------------------------------------///
export const typeSLayout = {
  labelCol: {
    sm: 6,
    md: 4,
    lg: 3,
    xl: 3,
    xxl: 2,
  },
  wrapperCol: {
    sm: 13,
    md: 10,
    lg: 7,
    xl: 6,
    xxl: 5,
  },
  notificationCol: {
    sm: 19,
    md: 14,
    lg: 10,
    xl: 9,
    xxl: 7,
  },
};

export const unlabelledTypeSLayout = {
  wrapperCol: {
    sm: { span: typeSLayout.wrapperCol.sm, offset: typeSLayout.labelCol.sm },
    md: { span: typeSLayout.wrapperCol.md, offset: typeSLayout.labelCol.md },
    lg: { span: typeSLayout.wrapperCol.lg, offset: typeSLayout.labelCol.lg },
    xl: { span: typeSLayout.wrapperCol.xl, offset: typeSLayout.labelCol.xl },
    xxl: { span: typeSLayout.wrapperCol.xxl, offset: typeSLayout.labelCol.xxl },
  },
};

// ------------------------------------TYPE M----------------------------------------///
export const typeMLayout = {
  labelCol: {
    sm: 8,
    md: 6,
    lg: 5,
    xl: 4,
    xxl: 3,
  },
  wrapperCol: {
    sm: 13,
    md: 10,
    lg: 7,
    xl: 6,
    xxl: 5,
  },
  notificationCol: {
    sm: 21,
    md: 16,
    lg: 12,
    xl: 10,
    xxl: 8,
  },
};

export const unlabelledTypeMLayout = {
  wrapperCol: {
    sm: { span: typeMLayout.wrapperCol.sm, offset: typeMLayout.labelCol.sm },
    md: { span: typeMLayout.wrapperCol.md, offset: typeMLayout.labelCol.md },
    lg: { span: typeMLayout.wrapperCol.lg, offset: typeMLayout.labelCol.lg },
    xl: { span: typeMLayout.wrapperCol.xl, offset: typeMLayout.labelCol.xl },
    xxl: { span: typeMLayout.wrapperCol.xxl, offset: typeMLayout.labelCol.xxl },
  },
};

// ------------------------------------TYPE L----------------------------------------///
export const typeLLayout = {
  labelCol: {
    sm: 10,
    md: 8,
    lg: 6,
    xl: 5,
    xxl: 4,
  },
  wrapperCol: {
    sm: 13,
    md: 10,
    lg: 7,
    xl: 6,
    xxl: 5,
  },
  notificationCol: {
    sm: 23,
    md: 18,
    lg: 13,
    xl: 11,
    xxl: 9,
  },
};

export const unlabelledTypeLLayout = {
  wrapperCol: {
    sm: { span: typeLLayout.wrapperCol.sm, offset: typeLLayout.labelCol.sm },
    md: { span: typeLLayout.wrapperCol.md, offset: typeLLayout.labelCol.md },
    lg: { span: typeLLayout.wrapperCol.lg, offset: typeLLayout.labelCol.lg },
    xl: { span: typeLLayout.wrapperCol.xl, offset: typeLLayout.labelCol.xl },
    xxl: { span: typeLLayout.wrapperCol.xxl, offset: typeLLayout.labelCol.xxl },
  },
};

export const modalFormLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  notificationCol: { span: 24 },
};

export const unAuthorizedFormLayout = {
  wrapperCol: {
    span: 24,
  },
  notificationCol: {
    span: 24,
  },
};

export const tableFormLayoutPrivileges = {
  wrapperCol: { span: 24 },
};
