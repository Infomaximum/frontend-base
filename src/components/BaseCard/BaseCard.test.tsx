import { mount } from "enzyme";
import BaseCard from "./BaseCard";
import { keyframes } from "@emotion/react";
import { getRouterWrapper } from "src/utils/tests/wrappers";

describe("Тест компонента BaseCard", () => {
  // Тест на "Вызов функции 'onAnimationEnd' не работает
  xit("Вызов функции 'onAnimationEnd' - тест на этот метод не работает", (done) => {
    const props = {
      styleWrapper: {
        animation: `${keyframes({
          "0%": { transform: "translateX(0px)" },
          "10%": { transform: "translateX(-5px)" },
          "20%": { transform: "translateX(10px)" },
          "30%": { transform: "translateX(-20px)" },
          "40%": { transform: "translateX(20px)" },
          "50%": { transform: "translateX(-15px)" },
          "60%": { transform: "translateX(10px)" },
          "70%": { transform: "translateX(-7px)" },
          "80%": { transform: "translateX(4px)" },
          "90%": { transform: "translateX(-2px)" },
          "100%": { transform: "translateX(0px)" },
        })} 1s ease-out`,
      },
      onAnimationEnd: jest.fn(),
    };

    const component = mount(<BaseCard {...props}>TEST</BaseCard>);

    setTimeout(() => {
      component.setProps({ styleWrapper: {} });
      expect(component.props().onAnimationEnd).toHaveBeenCalled();
      done();
    }, 1000);
  });

  it("Наличие 'card-header' если есть 'title'", () => {
    const component = mount(
      getRouterWrapper(<BaseCard title="Заголовок">TEST</BaseCard>)
    );

    expect(component.find("div > div").exists()).toEqual(true);
  });

  it("Наличие 'wrapper-menu' и 'card-header' если есть 'menu'", () => {
    const component = mount(
      getRouterWrapper(<BaseCard menu="Меню">TEST</BaseCard>)
    );

    expect(component.find("div > div").exists()).toEqual(true);
    expect(component.find("div > div > div").exists()).toEqual(true);
  });
});
