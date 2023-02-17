export const CLOSE = {
  ru: "Закрыть",
  en: "Close",
};

export const CONTINUE = {
  ru: "Продолжить",
  en: "Continue",
};

export const ERROR_MESSAGE = {
  ru: "Необратимое действие/Ошибка",
  en: "Irreversible action/Error",
};

export const ERROR = {
  ru: "Ошибка",
  en: "Error",
};

export const COPY_TO_CLIPBOARD = {
  ru: "Копировать в буфер обмена",
  en: "Copy to clipboard",
};

export const DELETION = {
  ru: "Удаление",
  en: "Deletion",
};

export const DELETE = {
  ru: "Удалить",
  en: "Delete",
};

export const CANCEL = {
  ru: "Отмена",
  en: "Cancel",
};

export const CONFIRM = {
  ru: "Подтвердить",
  en: "Confirm",
};

export const DO_NOT_SAVE = {
  ru: "Не сохранять",
  en: "Don't save",
};

export const APPLY = {
  ru: "Применить",
  en: "Apply",
};

export const SAVE = {
  ru: "Сохранить",
  en: "Save",
};

export const UNSAVED_CHANGES = {
  ru: "У вас есть несохраненные изменения",
  en: "You have unsaved changes",
};

export const UNABLE_TO_SAVE_CHANGE = {
  ru: "У вас есть изменения, которые нельзя сохранить из-за ошибок на форме",
  en: "You have changes that cannot be saved due to errors on the form",
};

export const ADD = {
  ru: "Добавить",
  en: "Add",
};

export const NOTHING_FOUND = {
  ru: "Ничего не найдено",
  en: "Nothing found",
};

export const NO_ACCESS = {
  ru: "Нет доступа",
  en: "No access",
};

export const NO_OBJECTS_MATCHING_FILTER_CRITERIA = {
  ru: "Нет объектов, подходящих условиям фильтра",
  en: "No objects matching filter criteria",
};

export const EMPTY_HERE = {
  ru: "Здесь пусто",
  en: "It's empty",
};

export const DONT_SHOW_AGAIN = {
  ru: "Больше не показывать",
  en: "Don't show again",
};

export const SHOW_MORE = {
  ru: "Показать ещё",
  en: "Show more",
};

export const NOTIFICATION = {
  ru: "Оповещение",
  en: "Notification",
};

export const ENTER_OR_SELECT_FROM_THE_LIST = {
  ru: "Введите или выберите из списка",
  en: "Enter or select from the list",
};

export const NOT_SELECTED = {
  ru: "Не выбрано",
  en: "Not selected",
};

export const SELECT_FROM_LIST = {
  ru: "Выберите из списка",
  en: "Select from list",
};

export const NOTHING_FOUND_CHANGE_QUERY = {
  ru: "Ничего не найдено. Измените запрос.",
  en: "Nothing found. Change the query.",
};

export const SHOWING_OF = {
  ru: ({ currentCount, totalCount }: { currentCount: number; totalCount: number }) =>
    `Показано ${currentCount} из ${totalCount}`,
  en: ({ currentCount, totalCount }: { currentCount: number; totalCount: number }) =>
    `Showing ${currentCount} of the ${totalCount}`,
};

export const SERVICE_MODE = {
  ru: "Система находится в сервисном режиме: ведутся регламентно-технические работы.",
  en: "System is in a service mode: regulatory and technical work is going.",
};

export const LOG_IN = {
  ru: "Вход",
  en: "Login",
};

export const SETTINGS = {
  ru: "Настройки",
  en: "Settings",
};

export const LOG_OUT = {
  ru: "Выйти",
  en: "Log out",
};

export const ERROR_404 = {
  ru: "Ошибка 404",
  en: "Error 404",
};

export const CHANGES_SAVED = {
  ru: "изменения сохранены",
  en: "changes saved",
};

export const RENAMED_MASCULINE = {
  ru: "переименован",
  en: "renamed",
};

export const RENAMED_FEMININE = {
  ru: "переименована",
  en: "renamed",
};

export const DELETED_MASCULINE = {
  ru: "удален",
  en: "deleted",
};

export const DELETED_FEMININE = {
  ru: "удалена",
  en: "deleted",
};

export const OBJECTS_DELETED = {
  ru: "Объекты удалены",
  en: "Objects deleted",
};

export const SAVED = {
  ru: "Сохранено",
  en: "Saved",
};

export const MASS_ACTION = {
  ru: "Массовое действие",
  en: "Mass action",
};

export const APPLIED_TO = {
  ru: "применено к",
  en: "applied to",
};

export const CREATED_FEMININE = {
  ru: "Создана",
  en: "Created",
};

export const CREATED_MASCULINE = {
  ru: "Создан",
  en: "Created",
};

export const MOVED_TO = {
  ru: "перемещен в",
  en: "has been moved to",
};

export const SWITCHED_ENABLED = {
  ru: "Вкл",
  en: "On",
};

export const SWITCHED_OFF = {
  ru: "Откл",
  en: "Off",
};

export const NOT_SET = {
  ru: "Не задано",
  en: "Not specified",
};

export const PASSWORD = {
  ru: "Пароль",
  en: "Password",
};

export const CHANGE_PASSWORD = {
  ru: "Изменить пароль",
  en: "Change password",
};

export const ENTER_QUERY_OR_CHOOSE = {
  ru: ({ currentCount, generalCount }: { currentCount: number; generalCount: number }) =>
    `Показаны ${currentCount} из ${generalCount} значений. Введите поисковой запрос или выберите из списка.`,
  en: ({ currentCount, generalCount }: { currentCount: number; generalCount: number }) =>
    `Showing ${currentCount} of "${generalCount}" values. Enter a search query or select from the list.`,
};

export const REFINE_QUERY = {
  ru: ({ currentCount, generalCount }: { currentCount: number; generalCount: number }) =>
    `Показаны ${currentCount} из ${generalCount} найденных значений. Уточните запрос, чтобы увидеть другие.`,
  en: ({ currentCount, generalCount }: { currentCount: number; generalCount: number }) =>
    `Showing ${currentCount} of the ${generalCount} values found. Refine the query to see others.`,
};

export const SHOWED_ALL_CHANGE_QUERY = {
  ru: "Показаны все найденные значения. Измените запрос, чтобы увидеть другие.",
  en: "All values found are shown. Change the query to see others.",
};

export const CURRENT_PASSWORD = {
  ru: "Текущий пароль",
  en: "Current password",
};

export const ENTER_NEW_PASSWORD = {
  ru: "Введите новый пароль",
  en: "Enter new password",
};

export const REPEAT_NEW_PASSWORD = {
  ru: "Повторите новый пароль",
  en: "Repeat new password",
};

export const LATIN_UPPERCASE_LETTERS = {
  // out of date
  ru: "латинские прописные буквы (A-Z)",
  en: "English uppercase characters (A-Z)",
};

export const LATIN_LOWERCASE_LETTERS = {
  // out of date
  ru: "латинские строчные буквы (a-z)",
  en: "English lowercase characters (a-z)",
};

export const NUMBERS = {
  // out of date
  ru: "цифры (0-9)",
  en: "base 10 digits (0-9)",
};

export const NON_ALPHABETIC_CHARACTERS = {
  // out of date
  ru: "неалфавитные символы (!, $, #, % и т.д.)",
  en: "non-alphabetic characters (!, $, #, %, etc.)",
};

export const NOT_LESS_SYMBOL = {
  ru: ({ minLength }: { minLength: number }) => ({
    s: `не менее ${minLength} символа`,
    p1: `не менее ${minLength} символов`,
  }),
  en: ({ minLength }: { minLength: number }) => ({
    s: `${minLength} character at least`,
    p1: `${minLength} characters at least`,
  }),
};

export const PASSWORDS_MUST_BE_EQUAL = {
  // out of date
  ru: "Подтверждение не совпадает с паролем",
  en: "Confirmation does not match the password",
};

export const YOU_NEED_SET_PASSWORD = {
  ru: "Сначала нужно задать пароль здесь",
  en: "First you need to set a password here",
};

export const PASSWORD_IS_NOT_SECURE = {
  ru: "Пароль не соответствует требованиям безопасности",
  en: "The password does not meet the security requirements",
};

export const START_DATE = {
  ru: "Начальная дата",
  en: "Start date",
};

export const END_DATE = {
  ru: "Конечная дата",
  en: "End date",
};

export const START_MONTH = {
  ru: "Начальный месяц",
  en: "Start month",
};

export const END_MONTH = {
  ru: "Конечный месяц",
  en: "End month",
};

export const WEEK = {
  ru: "Неделя",
  en: "Week",
};

export const CLICK_OR_DRAG_FILE = {
  ru: "Нажмите или перетащите файл сюда",
  en: "Click or drag file here",
};

export const FILE_FORMAT = {
  ru: ({ fileFormat }: { fileFormat: string }) => `Формат файла: ${fileFormat}`,
  en: ({ fileFormat }: { fileFormat: string }) => `File format: ${fileFormat}`,
};

export const UPLOAD_THE_FILE_IN_THE_FORMAT = (accept: string) => ({
  ru: `Загрузите файл в формате ${accept}`,
  en: `Upload the file in the format ${accept}`,
});

export const SEARCH = {
  ru: "Поиск",
  en: "Search",
};

export const SELECTED = {
  ru: "Выбрано",
  en: "Selected",
};

export const ALL = {
  // out of date
  ru: "Все",
  en: "All",
};

export const EMPTY_STRING = {
  ru: "Пустая строка",
  en: "Empty string",
};
