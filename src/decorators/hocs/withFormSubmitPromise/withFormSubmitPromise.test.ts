import { shuffle, xor } from "lodash";
import { excludeArrayFieldWrapperNames } from "./withFormSubmitPromise.utils";

describe("Тест withFormSubmitPromise", () => {
  it("Тест исключения имени ArrayField-обертки", () => {
    const testFields = {
      fieldNames: [
        "TEST_FIELD",
        "TEST_FIELD[0]",
        "PHONE_NUMBER",
        "OTHER_FIELD",
        "TEST_FIELD[2]",
        "PHONE_NUMBER[65]",
      ],
      result: [
        "TEST_FIELD[0]",
        "TEST_FIELD[2]",
        "PHONE_NUMBER[65]",
        "OTHER_FIELD",
      ],
    };

    expect(
      xor(
        excludeArrayFieldWrapperNames(shuffle(testFields.fieldNames)),
        testFields.result
      )
    ).toHaveLength(0);
  });
});
