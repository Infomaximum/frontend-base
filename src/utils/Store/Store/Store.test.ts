import typenameToModel from "src/models/typenameToModel";
import { graphqlTag } from "@im/utils";
import { forEach, set } from "lodash";
import { Store } from "./Store";
import { Model } from "@im/models";

class TestModel extends Model {
  static override get typename() {
    return "test_typename";
  }
}

typenameToModel.registrationModels([TestModel]);

const fakeId = 1;
const fakeDisplayName = "Alexandr Ivanov";

const fakeServerResponseRequestData = set({}, "employee.employee", {
  id: fakeId,
  display_name: fakeDisplayName,
  __typename: TestModel.typename,
});

const fakeServerResponseSubmitData = set({}, "employee.update", {
  id: fakeId,
});

const fakeError = {
  code: "not_unique_value",
  parameters: {
    field_value: "1",
    type: "Employee",
    field_name: "personnel_number",
  },
};

const requestInstanceMocks = {
  requestData: jest.fn(),
  submitData: jest.fn(),
  subscribe: jest.fn(),
  cancelRequests: jest.fn(),
  unsubscribe: jest.fn(),
};

const getStore = () =>
  new Store<TestModel>({
    name: "Test",
    dataPath: "employee.employee",
    requestInstance: requestInstanceMocks,
    getQueryParams({ variables }) {
      return {
        query: graphqlTag`
            query Employee {
              employee {
                employee(id: 1) {
                  id
                  name
                } 
              }
            }
        `,
        variables,
      };
    },
  });

describe("Тестирование Store", () => {
  beforeEach(() => {
    forEach(requestInstanceMocks, (mock) => {
      mock.mockReset();
    });
  });

  it("Запрос (requestData) выполняется успешно", async () => {
    requestInstanceMocks.requestData.mockResolvedValue(
      fakeServerResponseRequestData
    );

    const store = getStore();

    expect(store.isLoading).toEqual(false);
    expect(store.isDataLoaded).toEqual(false);
    expect(store.model).toBeNull();

    const promise = store.requestData({
      variables: {
        id: fakeId,
      },
    });

    expect(store.isLoading).toEqual(true);
    expect(store.isDataLoaded).toEqual(false);
    expect(store.model).toBeNull();

    expect(requestInstanceMocks.requestData).toBeCalledTimes(1);
    expect(
      requestInstanceMocks.requestData.mock.calls[0][0].variables.id
    ).toEqual(fakeId);

    await promise;

    expect(store.isLoading).toEqual(false);
    expect(store.isDataLoaded).toEqual(true);
    expect(store.isLoadedNilData).toEqual(false);

    expect(store.model?.getId()).toEqual(fakeId);
    expect(store.model?.getDisplayName()).toEqual(fakeDisplayName);
  });

  it("Запрос (requestData) выполняется с ошибкой", async () => {
    requestInstanceMocks.requestData.mockReset();
    requestInstanceMocks.requestData.mockRejectedValue(fakeError);

    const store = getStore();

    try {
      const promise = store.requestData({
        variables: {
          id: fakeId,
        },
      });

      expect(requestInstanceMocks.requestData).toBeCalledTimes(1);
      expect(store.isLoading).toEqual(true);

      await promise;

      throw "Должна была придти ошибка";
    } catch (error) {
      expect(error).toEqual(fakeError);

      expect(store.isLoading).toEqual(false);
    }

    store.clearError();

    expect(store.error).toBeUndefined();
  });

  it("Мутация (submitData) выполняется успешно", async () => {
    requestInstanceMocks.submitData.mockResolvedValue(
      fakeServerResponseSubmitData
    );

    const store = getStore();

    expect(store.isLoading).toEqual(false);
    expect(store.isSubmitting).toEqual(false);

    const promise = store.submitData({
      mutation: graphqlTag<{
        id: number;
        first_name: string;
      }>`mutation UpdateEmployee {
        employee {
          update(id: 1, first_name: "qwe"){id}
        }
      }`,
      variables: {
        id: fakeId,
        first_name: "Alex",
      },
    });

    expect(store.isLoading).toEqual(false);
    expect(store.isSubmitting).toEqual(true);

    await promise;

    const { id, first_name } =
      requestInstanceMocks.submitData.mock.calls[0][0].variables;

    expect(requestInstanceMocks.submitData).toBeCalledTimes(1);
    expect(id).toEqual(fakeId);
    expect(first_name).toEqual("Alex");
  });
});
