export const rootPath = "/";

export const noMatchPath = "*";

export const moduleGroupPath = "_";

/* ------------------------------ Логин [START] ----------------------------------- */
export const loginPath = `${rootPath}login`;
export const initializePath = `${rootPath}initialize`;
export const restorePath = `${rootPath}restore`;
export const changePasswordPath = `${rootPath}change-password/:token`;
export const inviteSetPasswordPath = `${rootPath}invite-set-password/:token`;
export const updatePasswordPath = `${rootPath}update-password`;
/* ------------------------------ Логин [END] ----------------------------------- */

// Перенаправление на предыдущую страницу (применяется, для перезагрузки текущей страницы настроек)
export const goBackPath = `${rootPath}go-back`;
