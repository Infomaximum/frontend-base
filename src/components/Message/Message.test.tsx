import React, { useCallback } from "react";
import { shallow } from "enzyme";
import { Message } from "./Message";
import { Localization } from "@infomaximum/localization";
import type { ReactElement } from "react";
import type {
  IMessageProps,
  TRemoveMessageProps,
  TGetMassAssignMessageParams,
} from "./Message.types";
import { waitForComponentToPaint } from "../../utils/tests/utils";
import { getStyledAndLocalizedEntities } from "./Message.utils";

const ACCESS_ROLE = {
  ru: "Роль доступа",
  en: "Access role",
};

const DEPARTMENT = {
  ru: "Отдел",
  en: "Department",
};

const USER = {
  ru: "Пользователь",
  en: "User",
};

const TestComponent: React.FC<IMessageProps> = (props) => {
  const { notification, messageDuration, type } = props;

  const handleMessage = useCallback(() => {
    Message.showMessage({ messageDuration, notification, type });
  }, [messageDuration, notification, type]);

  return <button onClick={handleMessage}>Click</button>;
};

describe("Тесты методов класса 'Message'", () => {
  const localization = new Localization({ language: Localization.Language.ru });
  const navigate = jest.fn();
  const preventDefault = jest.fn();
  const path = "/test";

  beforeEach(() => {
    navigate.mockReset();
  });

  it("Тест метода 'getCustomMessage'", () => {
    const notification = "test getCustomMessage";
    const message = Message.getCustomMessage(notification);
    const component = !!message && shallow(message);
    expect(component && component.find("div").text()).toEqual(notification);
  });

  it("Тест метода 'getDefaultSaveMessage'", () => {
    expect(Message.getDefaultSaveMessage(localization)).toEqual("Сохранено");
  });

  it("Тест метода 'getCreateMessage'", () => {
    const entityLoc = ACCESS_ROLE;
    const linkCaption = "тест";
    const feminineGenus = true;
    const component = shallow(
      Message.getCreateMessage(
        localization,
        entityLoc,
        navigate,
        path,
        linkCaption,
        feminineGenus
      ) as ReactElement
    );
    component.find("a").simulate("click", { preventDefault });
    expect(component.find("div").text()).toEqual(`Создана роль доступа ${linkCaption}`);
    expect(navigate).toHaveBeenLastCalledWith(path, {
      state: { displayName: linkCaption },
    });
  });

  it("Тест метода 'getMoveMessage'", () => {
    const entityLoc = USER;
    const entityPlaceLoc = DEPARTMENT;
    const entityInstancePlace = "Руководители";
    const linkCaption = "admin admin";
    const message = Message.getMoveMessage(
      localization,
      entityLoc,
      navigate,
      path,
      linkCaption,
      entityPlaceLoc,
      entityInstancePlace
    );
    const component = !!message && shallow(message);
    component && component.find("a").simulate("click", { preventDefault });
    expect(component && component.find("div").text()).toEqual(
      `Пользователь ${linkCaption} перемещен в отдел ${entityInstancePlace}`
    );
    expect(navigate).toHaveBeenLastCalledWith(path, {
      state: { displayName: linkCaption },
    });
  });

  describe("Тесты метода 'getMassAssignMessage'", () => {
    const params: TGetMassAssignMessageParams = {
      localization,
      entityLoc: ACCESS_ROLE,
      entityValue: "Сотрудник",
      genus: "female",
    };

    const component = (params: TGetMassAssignMessageParams) =>
      shallow(Message.getMassAssignMessage(params));

    it("Массовое назначение genus=female", () => {
      expect(component(params).find("div").text()).toEqual("Роль доступа – Сотрудник применена");
    });

    it("Массовое назначение genus=male", () => {
      const MONITORING = {
        ru: "Мониторинг",
        en: "Monitoring",
      };

      const params: TGetMassAssignMessageParams = {
        localization,
        entityLoc: MONITORING,
        entityValue: "Откл",
      };

      expect(component(params).find("div").text()).toEqual("Мониторинг – Откл применен");
    });
    it("Массовое назначение genus=neuter", () => {
      const DISTRIBUTION = {
        ru: "Распределение",
        en: "Allocation",
      };

      const entities = getStyledAndLocalizedEntities(true, localization);

      const params: TGetMassAssignMessageParams = {
        localization,
        entityLoc: DISTRIBUTION,
        entityValue: entities,
        genus: "neuter",
      };

      expect(component(params).find("div").text()).toEqual("Распределение – Вкл применено");
    });
  });

  describe("Тесты метода 'getStandardMessage'", () => {
    let localizedPrefix: string | React.ReactNode;
    let linkCaption: string;
    const getComponent = () =>
      shallow(
        Message.getStandardMessage(localizedPrefix, navigate, path, linkCaption) as ReactElement
      );

    it("Если метод возвращает обычное сообщение", () => {
      localizedPrefix = "тест";
      expect(getComponent().find("div").text()).toEqual(localizedPrefix);
    });

    it("Если метод возвращает сообщение формата: текст ссылка", () => {
      localizedPrefix = "Изменения в модели данных сохранены";
      linkCaption = "модель";

      getComponent().find("a").simulate("click", { preventDefault });
      expect(getComponent().find("div").text()).toEqual(`${localizedPrefix}: ${linkCaption}`);
      expect(navigate).toHaveBeenLastCalledWith(path, {
        state: { displayName: linkCaption },
      });
    });
  });

  describe("Тесты метода 'getRemoveMessage'", () => {
    const component = (props: TRemoveMessageProps) => shallow(Message.getRemoveMessage(props));
    const props = {
      feminineGenus: true,
      localization,
    };

    it("сообщение об удалении объекта сущности", () => {
      const nextProps = { ...props, entityLoc: ACCESS_ROLE, name: "сотрудник" };
      expect(component(nextProps).find("div").text()).toEqual("Роль доступа сотрудник удалена");
    });

    it("сообщение об удалении объектов сущности", () => {
      expect(component(props).find("div").text()).toEqual("Объекты удалены");
    });
  });

  describe("Тесты методов 'getRenameMessage' и 'getChangeMessage'", () => {
    enum EFieldName {
      Name = "Name",
      Position = "Position",
    }

    const initialValues = {
      [EFieldName.Name]: "Александр",
      [EFieldName.Position]: "Программист",
    };

    const props = {
      initialValues,
      localization,
      blockUri: path,
      messageOptions: {
        navigate,
        nameFieldKeyList: [EFieldName.Name],
        entityLoc: USER,
      },
    };

    it("Тест метода 'getRenameMessage'", () => {
      const formValues = {
        [EFieldName.Name]: "Шамиль",
        [EFieldName.Position]: "Электрик",
      };
      const message = Message.getRenameMessage(formValues, props);

      const component = !!message && shallow(message);

      expect(component && component.find("div").text()).toEqual(
        `Пользователь ${initialValues[EFieldName.Name]} переименован: ${
          formValues[EFieldName.Name]
        }`
      );

      component && component.find("a").simulate("click", { preventDefault });
      expect(navigate).toHaveBeenLastCalledWith(path, {
        state: { displayName: formValues[EFieldName.Name] },
      });
    });

    it("Тест метода 'getChangeMessage' если имя не изменилось", () => {
      const formValues = {
        [EFieldName.Name]: initialValues[EFieldName.Name],
        [EFieldName.Position]: "Менеджер",
      };
      const message = Message.getChangeMessage(formValues, props);

      const component = !!message && shallow(message);

      expect(component && component.find("div").text()).toEqual(
        `Пользователь ${initialValues[EFieldName.Name]}: изменения сохранены`
      );

      component && component.find("a").simulate("click", { preventDefault });
      expect(navigate).toHaveBeenLastCalledWith(path, {
        state: { displayName: initialValues[EFieldName.Name] },
      });
    });

    it("Тест метода 'getChangeMessage' если имя изменилось", () => {
      const formValues = {
        [EFieldName.Name]: "Женя",
        [EFieldName.Position]: "Менеджер",
      };
      const message = Message.getChangeMessage(formValues, props);

      const component = !!message && shallow(message);

      expect(component && component.find("div").text()).toEqual(
        `Пользователь ${formValues[EFieldName.Name]}: изменения сохранены`
      );

      component && component.find("a").simulate("click", { preventDefault });
      expect(navigate).toHaveBeenLastCalledWith(path, {
        state: { displayName: formValues[EFieldName.Name] },
      });
    });
  });

  describe("Тесты метода 'showMessage'", () => {
    const component = shallow(<TestComponent notification="Message test" />);
    const simulateCLick = () => component.find("button").simulate("click");
    const setPropsType = (type: string) => component.setProps({ type });
    const isIconElement = (selector: string) => !!document.querySelector(selector);

    // Тест работает только если закоментировать другие тесты
    xit("Тест на продолжительность сообщения", (done) => {
      component.setProps({ messageDuration: 1 });

      simulateCLick();
      const messageElement = document.querySelector(".ant-message > span");

      expect(messageElement?.hasChildNodes()).toEqual(true);
      setTimeout(() => {
        expect(messageElement?.hasChildNodes()).toEqual(false);
        done();
      }, 1001);
    });

    // Тест работает только если закоментировать другие тесты
    xit("Продолжительность сообщения если не передавать 'messageDuration' и 'notification' = string", (done) => {
      component.setProps({ messageDuration: undefined });
      simulateCLick();
      const messageElement = document.querySelector(".ant-message > span");

      expect(messageElement?.hasChildNodes()).toEqual(true);
      setTimeout(() => {
        expect(messageElement?.hasChildNodes()).toEqual(false);
        done();
      }, 3001);
    });

    it("Если тип сообщения 'success'", async () => {
      setPropsType("success");
      simulateCLick();
      await waitForComponentToPaint(component);
      expect(isIconElement("[data-icon='check-circle']")).toEqual(true);
    });

    it("Если тип сообщения 'error'", async () => {
      setPropsType("error");
      simulateCLick();
      await waitForComponentToPaint(component);
      expect(isIconElement("[data-icon='close-circle']")).toEqual(true);
    });

    it("Если тип сообщения 'info'", async () => {
      setPropsType("info");
      simulateCLick();
      await waitForComponentToPaint(component);
      expect(isIconElement("[data-icon='info-circle']")).toEqual(true);
    });

    it("Если тип сообщения 'warning'", async () => {
      setPropsType("warning");
      simulateCLick();
      await waitForComponentToPaint(component);
      expect(isIconElement("[data-icon='exclamation-circle']")).toEqual(true);
    });

    it("Если тип сообщения 'loading'", async () => {
      setPropsType("loading");
      simulateCLick();
      await waitForComponentToPaint(component);
      expect(isIconElement("[data-icon='loading']")).toEqual(true);
    });
  });
});
