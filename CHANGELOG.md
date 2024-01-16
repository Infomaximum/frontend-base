# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.1.0](https://github.com/Infomaximum/frontend-base/compare/v6.0.1...v6.1.0) (2024-01-16)


### Features

* добавлен атрибут lang у html ([393de89](https://github.com/Infomaximum/frontend-base/commit/393de8964bc8179b83984553aa4e0356ad13e13f))

### [6.0.1](https://github.com/Infomaximum/frontend-base/compare/v5.0.2...v6.0.1) (2023-10-02)

### [5.0.2](https://github.com/Infomaximum/frontend-base/compare/v5.0.1...v5.0.2) (2023-06-30)

### Bug Fixes

- исправлена передача expandable в Table ([ad30a78](https://github.com/Infomaximum/frontend-base/commit/ad30a786df40e16c20bddf0f3ec625410afcdef7))

### [5.0.1](https://github.com/Infomaximum/frontend-base/compare/v5.0.0...v5.0.1) (2023-06-30)

## [5.0.0](https://github.com/Infomaximum/frontend-base/compare/v4.1.1...v5.0.0) (2023-06-30)

### ⚠ BREAKING CHANGES

- изменены типы фильтрации

### Features

- добавлен пропс в ContextMenu, который позволяет выводить контент без обертки, если элементов контекстного меню нет, например отсеяны привилегиями ([7771263](https://github.com/Infomaximum/frontend-base/commit/77712634c2ec50af99126a8ca7bd2a6931f7eefe))
- добавлена возможность внешнего управления expandable в Table ([9506d24](https://github.com/Infomaximum/frontend-base/commit/9506d249591aac1b837a0141a171d96b3120f480))
- добавлено забледнение текста, при переполнении ([23b618d](https://github.com/Infomaximum/frontend-base/commit/23b618dcf43b8e619acbccbfd06c9fd0ac2c717d))
- добавлены возможность задавать стили в TableExpandIcon ([819ce99](https://github.com/Infomaximum/frontend-base/commit/819ce9944f29beac6f33b96db301267c003b01b0))
- исправлено именование пропса ContextMenu, добавлена приписка is ([f18a111](https://github.com/Infomaximum/frontend-base/commit/f18a111f3a03500eef88be5cbe1e4bf05abc3d82))
- перенесен TableStore из ветки с новым списком сотрудников для реализации подгрузки данных при скролле. Добавлен пропс для скрола в форму ([0f1c7a0](https://github.com/Infomaximum/frontend-base/commit/0f1c7a0a755a5aae0e0a3121276181e0c3082848))

### Bug Fixes

- Исправлен баг задержки появления head в таблицах ([2d44344](https://github.com/Infomaximum/frontend-base/commit/2d4434458c03d7bbae9a85e5e35b1879b074379e))
- исправлен импорт локализации ([a9503fc](https://github.com/Infomaximum/frontend-base/commit/a9503fcb2f360b153a69174d79f701898f5b52c4))
- исправлен фокус на поле пароля ([0a49244](https://github.com/Infomaximum/frontend-base/commit/0a492449bfed8490fa4761e744fdfbb3177bb1d4))
- Исправлен import assertSimple в boundMethod ([2411a16](https://github.com/Infomaximum/frontend-base/commit/2411a16d5be6a1987dce1341ac7b16db2739b007))
- исправлен messagePattern ([d8c3111](https://github.com/Infomaximum/frontend-base/commit/d8c31113ce3cd5ea0ffa2aba6375509d26278106))
- исправлена функция удаления сотрудника в селекте, после перехода на другую вкладку браузера и обратно ([22bd596](https://github.com/Infomaximum/frontend-base/commit/22bd596ae55afed26d3cf257711a0d970e4b33eb))
- исправлено раскрытие селекта после перехода по вкладкам браузера ([786dfeb](https://github.com/Infomaximum/frontend-base/commit/786dfebd3b37d60b37da33da27141a79435b6215))

- рефакторинг типов фильтров [PT-13538] ([fac65f2](https://github.com/Infomaximum/frontend-base/commit/fac65f21a206ea71dbbf2dedde83fd2c984d0185))

### [4.1.1](https://github.com/Infomaximum/frontend-base/compare/v4.1.0...v4.1.1) (2023-06-13)

### Bug Fixes

- исправлена проблема вызова history.replaceState при использовании библиотеки ([15bcfec](https://github.com/Infomaximum/frontend-base/commit/15bcfec58d5ce6bdeba9f6bc048b0c9e2e13263d))

## [4.1.0](https://github.com/Infomaximum/frontend-base/compare/v4.0.0...v4.1.0) (2023-06-09)

### Features

- переименованы интерфейсы ([772ca7b](https://github.com/Infomaximum/frontend-base/commit/772ca7b65006514f5db024872e4a7a2a7eac74b0))

## [4.0.0](https://github.com/Infomaximum/frontend-base/compare/v3.3.0...v4.0.0) (2023-06-07)

### ⚠ BREAKING CHANGES

- переименованы методы

### Features

- Разрешено выделение текста в header ([b90b4cf](https://github.com/Infomaximum/frontend-base/commit/b90b4cfa7828e460ed88bc243dac1bb128713fe0))

### Bug Fixes

- исправлены именования методов фильтрации getAddModalComponent -> getAddFilterComponent, getEditModalComponent -> getEditFilterComponent ([beaa0f2](https://github.com/Infomaximum/frontend-base/commit/beaa0f2770f9df3b1a07ece79ff8234c1743f765))

## [3.3.0](https://github.com/Infomaximum/frontend-base/compare/v3.2.0...v3.3.0) (2023-06-05)

### Features

- добавлен экспорт BaseFilter ([210b929](https://github.com/Infomaximum/frontend-base/commit/210b929e45fdf4b501fb4febbb1e8f6729bbd02c))

## [3.2.0](https://github.com/Infomaximum/frontend-base/compare/v3.1.0...v3.2.0) (2023-06-02)

### Features

- добавлен yarn.lock ([3e91cd5](https://github.com/Infomaximum/frontend-base/commit/3e91cd56480c09a441309f7d732899bdc6bae24b))
- добавлены фильтры ([5161dba](https://github.com/Infomaximum/frontend-base/commit/5161dba1141bc5d9275fb9b6d46308dd22dfaa36))

### Bug Fixes

- исправлен баг с не реагированием меню переключения страниц ([5797865](https://github.com/Infomaximum/frontend-base/commit/57978652e9ea6db13eb4af7b2078013b37c87942))
- исправлен циклический импорт ([4e8d758](https://github.com/Infomaximum/frontend-base/commit/4e8d758a7f711be849c827d5a19a022d2ac070b5))
- исправлены циклические импорты ([a4ef2ce](https://github.com/Infomaximum/frontend-base/commit/a4ef2ce5eaeeb5e31437985af8c566260731f100))
- убран boundMethod, исправлены импорты ([a206dce](https://github.com/Infomaximum/frontend-base/commit/a206dceec441d088660bd70694970cdea650aff8))

## [3.1.0](https://github.com/Infomaximum/frontend-base/compare/v3.0.0...v3.1.0) (2023-05-26)

### Features

- добавлен тип кнопки ghost-danger ([c8efcc5](https://github.com/Infomaximum/frontend-base/commit/c8efcc59ef7e3cdca2d0fa9d7623a9d304f0aad2))
- добавлен onClick для checkbox ([28b502f](https://github.com/Infomaximum/frontend-base/commit/28b502f1de9dce7a199b425f59d2dd06e53977bf))
- добавлен yarn.lock ([fdc252e](https://github.com/Infomaximum/frontend-base/commit/fdc252e76d4617d6b2adc38dd19d6cbce42a310a))
- использованы новые переменный из window ([98603b0](https://github.com/Infomaximum/frontend-base/commit/98603b0e3e5162544700587e1cd4f3a3f00687d4))
- новый тип id сущности ([645387f](https://github.com/Infomaximum/frontend-base/commit/645387f712855e9aa8a7cfe2ee2b3af82a5f4ee0))

### Bug Fixes

- исправлен тип, который подчеркивал использование CheckboxGroup ([a20db51](https://github.com/Infomaximum/frontend-base/commit/a20db51d941fcf7b82b62884100a68db6aa43fb7))

## [3.0.0](https://github.com/Infomaximum/frontend-base/compare/v2.9.0...v3.0.0) (2023-05-10)

### ⚠ BREAKING CHANGES

- поле list заменено на map
  [PT-13435]

### Features

- реализована возможность управления загрузкой контейнера ([e37f5b9](https://github.com/Infomaximum/frontend-base/commit/e37f5b90c8151386fd9cc4784021845aa8bb43c6))

### Bug Fixes

- исправлен порядок элементов с числовыми индексами в AutoCompleteStore ([f48768a](https://github.com/Infomaximum/frontend-base/commit/f48768a52afd29fd191ba650e171951db0fd2d08))
- исправлен стиль текста недоступных полей для Safari ([9617610](https://github.com/Infomaximum/frontend-base/commit/9617610c95d381dff6cd832308470c45fd400c1e))
- исправлена контрастность текста карточки пространства ([5df8194](https://github.com/Infomaximum/frontend-base/commit/5df8194d74f3dc071086f33014d4b68090ccafc1))
- исправлена отрисовка профиля сотрудника если не задано расширение loadingGetter ([fcf8eac](https://github.com/Infomaximum/frontend-base/commit/fcf8eace78e054c60c25ba733a6ba9aee5b5ef64))
- **test:** исправлен тест ([680e533](https://github.com/Infomaximum/frontend-base/commit/680e53324208330da52846265524799d391fedee))

## [2.9.0](https://github.com/Infomaximum/frontend-base/compare/v2.8.0...v2.9.0) (2023-04-20)

### Features

- реализована функция, возвращающая нужный стиль для тега Select, в зависимости от параметра closable [PT-13186] ([92e600e](https://github.com/Infomaximum/frontend-base/commit/92e600ed85c07543aa9ec6559c7f7b8fb30b36d4))

### Bug Fixes

- добавлена верхняя правая кнопка закрытия модального окна ошибки ([47a8157](https://github.com/Infomaximum/frontend-base/commit/47a81574c45d742e6c0a798658e69299f0d4fe3e))
- добавлена верхняя правая кнопка закрытия модальных окон подтверждения ([4eecfb1](https://github.com/Infomaximum/frontend-base/commit/4eecfb12458193c57042a605a4a6430aa629a157))
- исправлено некорректное отображение инпута в состоянии focused (обрезалась тень слева) [PT-13188] ([736a26c](https://github.com/Infomaximum/frontend-base/commit/736a26c5bb5608e48b77b091e22c56af41e2e97e))

## [2.8.0](https://github.com/Infomaximum/frontend-base/compare/v2.7.0...v2.8.0) (2023-04-17)

### Features

- В локализации изменен термин 'Сотрудник' на термин 'Пользователь' ([175fb77](https://github.com/Infomaximum/frontend-base/commit/175fb77d764425ebc796cf2e7936d15a2cdf8057))
- заменена иконка импорта ([d30c54d](https://github.com/Infomaximum/frontend-base/commit/d30c54de65c621278bdd25511a8d2216ff393685))

### Bug Fixes

- исправлена невозможность вводить текст поиска сразу в селектах ([f6103dc](https://github.com/Infomaximum/frontend-base/commit/f6103dc83653768609a502e4b31deac0a4aa30bb))
- сделана очистка строки поиска после выбора ([7d11a09](https://github.com/Infomaximum/frontend-base/commit/7d11a09c8a4418f50ad160707513bdb6acf908d5))
- сделано закрытие модального окна с ошибкой после перехода назад по клику по кнопке браузера. ([5b5e831](https://github.com/Infomaximum/frontend-base/commit/5b5e831ca4268fadac85df55b959264a929afdbb))

## [2.7.0](https://github.com/Infomaximum/frontend-base/compare/v2.6.0...v2.7.0) (2023-04-06)

### Features

- Добавлена возможность задавать конфигурацию колонок Header'а через props ([cc43768](https://github.com/Infomaximum/frontend-base/commit/cc43768e8599d66f2803a498b7eca47d5ba8be2e))
- реализован метод isHttps ([f40de5f](https://github.com/Infomaximum/frontend-base/commit/f40de5fbd9d65afdabe3de163f9567a440473065))

### Bug Fixes

- исправлено отображение фильтров ([4331645](https://github.com/Infomaximum/frontend-base/commit/433164566fb91dfb053a8c225830b8bfaa39d8cc))

## [2.6.0](https://github.com/Infomaximum/frontend-base/compare/v2.5.0...v2.6.0) (2023-03-31)

### Features

- восстановлена работоспособность css у HeaderMenu ([5135084](https://github.com/Infomaximum/frontend-base/commit/5135084acdde6bbd551553e4f796c4b3a0ae263b))
- добавлена возможность кастомизировать стили ([afa989d](https://github.com/Infomaximum/frontend-base/commit/afa989d0c4a091fec53fe045d7b8724454cce0fc))

## [2.5.0](https://github.com/Infomaximum/frontend-base/compare/v2.4.2...v2.5.0) (2023-03-30)

### Features

- первоначальные изменения в DataTable (свойство customDataSource), EditableDataTable (editingState, record в onRow) ([f7d49fe](https://github.com/Infomaximum/frontend-base/commit/f7d49fe14befe2f2e5da7965decfdb09b83273b7))

### 2.4.2 (2023-03-28)

### Bug Fixes

- исправлено описание ([26ab24e](https://github.com/Infomaximum/frontend-base/commit/26ab24e9c7e34ef7c133e70ee9ebd7b34c85b6ad))
