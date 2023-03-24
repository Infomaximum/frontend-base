import { TreeManager } from "./Tree";
import { InvalidIndex } from "@im/utils";
import { buildTreeFromList } from "../utils/extensions/graphqlTree.storeExt";
import { RestModel } from "../models/RestModel";
import { cloneDeep, set, unset, xor } from "lodash";
import { Group, type IModel, Model, type TModelStruct, TypenameToModel } from "@im/models";
import { assertSimple } from "@im/asserts";

type TItems = TreeItemModel | TreeGroupModel | RestModel;

type TNestedItem = { id: number };
type TNestedGroup = { id: number; items: TNestedData[] };
type TNestedRest = { next_count: number };
type TNestedData = TNestedItem | TNestedGroup | TNestedRest;

type TExpectedState = {
  accumulatedCheckedKeys: string[];
  checkedKeys: string[];
  indeterminateKeys: string[];
};

const typenameGroup = "tree_component_group";
const typenameModel = "tree_component_model";

const typenameToModel = new TypenameToModel();

class TreeGroupModel extends Group {
  public static override get typename() {
    return typenameGroup;
  }

  public getItems(): TItems[] {
    return this.getListField<TItems>("items", typenameToModel);
  }

  public getParents(): TreeGroupModel[] {
    return this.getListField("parents", typenameToModel);
  }

  public isHidden() {
    return this.getBoolField("hidden");
  }
}

class TreeItemModel extends Model {
  public static override get typename() {
    return typenameModel;
  }

  public getParents(): TreeGroupModel[] {
    return this.getListField("parents", typenameToModel);
  }

  public isHidden() {
    return this.getBoolField("hidden");
  }
}

typenameToModel.registrationModels([TreeGroupModel, TreeItemModel, RestModel]);

const generateRawData = (data: TNestedData, parents: number[]): TModelStruct[] => {
  const checkIsGroup = (data: TNestedData): data is TNestedGroup => {
    return (data as TNestedGroup).items !== undefined;
  };
  const checkIsRest = (data: TNestedData): data is TNestedRest => {
    return (data as TNestedRest).next_count !== undefined;
  };

  if (checkIsRest(data)) {
    return [
      {
        element: null,
        parents,
        hidden: false,
        next_count: data.next_count,
      } as unknown as TModelStruct,
    ];
  }

  if (checkIsGroup(data)) {
    const nextParents = ~data.id ? [...parents, data.id] : parents;

    const children = data.items.flatMap((item: TNestedData) => generateRawData(item, nextParents));

    return [
      {
        element: { id: data.id, __typename: typenameGroup },
        parents,
        hidden: false,
        next_count: 0,
      } as unknown as TModelStruct,
      ...children,
    ];
  }

  return [
    {
      element: { id: data.id, __typename: typenameModel },
      hidden: false,
      parents,
      next_count: 0,
    } as unknown as TModelStruct,
  ];
};

function buildModel(nestedData: TNestedData): TreeGroupModel {
  const treeData = generateRawData(nestedData, []);
  return new TreeGroupModel({
    struct: {
      id: InvalidIndex,
      __typename: typenameGroup,
      items: buildTreeFromList(treeData as TModelStruct[], {
        parentsIdsField: "parents",
        groupTypename: typenameGroup,
        isAddParentsChain: true,
      }),
      hidden: false,
    },
  });
}

const nestedData: TNestedGroup = {
  id: InvalidIndex,
  items: [
    { id: 1 },
    { id: 2 },
    { id: 3, items: [{ id: 4 }] },
    {
      id: 5,
      items: [
        {
          id: 6,
          items: [{ id: 16 }, { id: 21 }, { id: 22 }, { next_count: 2 }],
        },
        { id: 7 },
        { id: 8 },
        { id: 17 },
        { next_count: 2 },
      ],
    },
    {
      id: 9,
      items: [{ id: 10 }, { id: 11 }],
    },
    { id: 12 },
    { id: 13 },
    { id: 14 },
    { id: 15 },
  ],
};

const rootModel = buildModel(nestedData);

const nestedData2 = cloneDeep(nestedData);
set(nestedData2, "items[3].items[4]", { id: 18 });
set(nestedData2, "items[3].items[5]", { id: 19 });
const rootModelExpandedGroup = buildModel(nestedData2);

const nestedData3 = cloneDeep(nestedData);
set(nestedData3, "items[9]", { next_count: 2 });
const rootModelWithShowMore = buildModel(nestedData3);

const nestedData4 = cloneDeep(nestedData);
set(nestedData4, "items[9]", { id: 18 });
set(nestedData4, "items[10]", { id: 19 });
const rootModelExpanded = buildModel(nestedData4);

const rowBuilder = (model: IModel) => {
  const row = {
    model,
    id: model.getId(),
    key: model.getInnerName(),
  };

  return row;
};

function assertContainSameElements(arr1: any[], arr2: any[]) {
  expect(xor(arr1, arr2)).toHaveLength(0);
}

const testState = (tree: TreeManager, expectedState: TExpectedState) => {
  const checkedState = tree.getCheckedStateDispatchData();

  assertContainSameElements(
    checkedState.accumulatedKeys ?? [],
    expectedState.accumulatedCheckedKeys
  );
  assertContainSameElements(checkedState.keys ?? [], expectedState.checkedKeys);

  tree.getNodesKeys().forEach((key) => {
    const element = tree.getNodeByKey(key);
    assertSimple(!!element, "Попытка проверить несуществующий элемент");

    const isIndeterminate = tree.isCheckIndeterminate(element);

    if (expectedState.indeterminateKeys.includes(key)) {
      expect(isIndeterminate).toBe(true);
    } else {
      expect(isIndeterminate).toBe(false);
    }
  });
};

describe("Тесты методов класса 'TreeManager'", () => {
  it("Выделение группы с 'Показать ещё'", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
      isFilteredTree: false,
    });

    const expectedAfterFirstClick = [
      "tree_component_model_16",
      "tree_component_model_21",
      "tree_component_model_22",
      "tree_component_group_rest_6_2",
      "tree_component_group_6",
    ];
    tree.onModelChange(rootModel, {});
    tree.handleSelect(tree.getNodeByKey("tree_component_group_6"), true);

    testState(tree, {
      accumulatedCheckedKeys: expectedAfterFirstClick,
      checkedKeys: expectedAfterFirstClick,
      indeterminateKeys: ["tree_component_group_5"],
    });

    const expectedAfterSecondClick = [
      "tree_component_model_16",
      "tree_component_model_21",
      "tree_component_model_22",
    ];

    tree.handleSelect(tree.getNodeByKey("tree_component_group_6"), false);
    testState(tree, {
      accumulatedCheckedKeys: expectedAfterSecondClick,
      checkedKeys: expectedAfterSecondClick,
      indeterminateKeys: ["tree_component_group_5", "tree_component_group_6"],
    });
  });

  it("Выделение группы без 'Показать ещё'", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
      isFilteredTree: true,
    });
    tree.onModelChange(rootModel, {});

    const expectedAfterFirstClick = [
      "tree_component_model_10",
      "tree_component_model_11",
      "tree_component_group_9",
    ];

    tree.handleSelect(tree.getNodeByKey("tree_component_group_9"), true);
    testState(tree, {
      accumulatedCheckedKeys: expectedAfterFirstClick,
      checkedKeys: expectedAfterFirstClick,
      indeterminateKeys: [],
    });

    const expectedAfterSecondClick = ["tree_component_model_10", "tree_component_model_11"];

    tree.handleSelect(tree.getNodeByKey("tree_component_group_9"), false);
    testState(tree, {
      accumulatedCheckedKeys: expectedAfterSecondClick,
      checkedKeys: expectedAfterSecondClick,
      indeterminateKeys: ["tree_component_group_9"],
    });
  });

  it("Выделение всего списка с 'Показать ещё'", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
    });

    tree.onModelChange(rootModelWithShowMore, {});
    tree.handleSelect(undefined, true);
    expect(tree.treeCounter.targetAll).toBe(true);
    tree.handleSelect(undefined, false);
    expect(tree.treeCounter.totalCheckedCount).not.toBe(0);
  });

  it("Выделение всего списка без 'Показать ещё'", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
    });

    tree.onModelChange(rootModel, {});
    tree.handleSelect(undefined, true);
    expect(tree.treeCounter.targetAll).toBe(true);
    tree.handleSelect(undefined, false);
    expect(tree.treeCounter.totalCheckedCount).toBe(0);
  });

  it("Очистка выделенных элементов", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
    });

    tree.onModelChange(rootModel, {});
    tree.handleSelect(undefined, true);
    tree.clearSelection();
    expect(tree.treeCounter.totalCheckedCount).toBe(0);
  });

  it("Раскрытие невыделенного 'Показать ещё' в группе", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
      isFilteredTree: false,
    });
    tree.onModelChange(rootModelWithShowMore, {});

    const expected = [
      "tree_component_model_16",
      "tree_component_model_21",
      "tree_component_model_22",
      "tree_component_group_rest_6_2",
      "tree_component_group_6",
      "tree_component_model_7",
      "tree_component_model_8",
      "tree_component_model_17",
    ];

    const elementForCheck = tree.getNodeByKey("tree_component_group_5");
    tree.handleSelect(elementForCheck, true);
    tree.handleSelect(elementForCheck, false);
    tree.onModelChange(rootModelExpandedGroup, {});
    tree.updateSelection();

    testState(tree, {
      accumulatedCheckedKeys: expected,
      checkedKeys: expected,
      indeterminateKeys: ["tree_component_group_5"],
    });
  });

  it("Выделение элементов при раскрытии 'Показать ещё' в группе", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
      isFilteredTree: false,
    });
    tree.onModelChange(rootModelWithShowMore, {});

    const expected = [
      "tree_component_model_16",
      "tree_component_model_21",
      "tree_component_model_22",
      "tree_component_group_rest_6_2",
      "tree_component_group_6",
      "tree_component_model_7",
      "tree_component_model_8",
      "tree_component_model_17",
      "tree_component_group_5",
      "tree_component_model_18",
      "tree_component_model_19",
    ];

    const elementForCheck = tree.getNodeByKey("tree_component_group_5");
    tree.handleSelect(elementForCheck, true);
    tree.onModelChange(rootModelExpandedGroup, {});
    tree.updateSelection();

    testState(tree, {
      accumulatedCheckedKeys: expected,
      checkedKeys: expected,
      indeterminateKeys: [],
    });
  });

  it("Выделение элементов, найденных в 'Показать ещё', если группа была выделена", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
      isFilteredTree: true,
    });
    tree.onModelChange(rootModelWithShowMore, {});

    const expected = [
      "tree_component_model_16",
      "tree_component_model_21",
      "tree_component_model_22",
      "tree_component_group_6",
      "tree_component_model_17",
      "tree_component_group_5",
    ];

    const elementForCheck = tree.getNodeByKey("tree_component_group_5");
    tree.handleSelect(elementForCheck, true);

    const clonedData = cloneDeep(nestedData);
    unset(clonedData, "items[3].items[1]");
    unset(clonedData, "items[3].items[2]");

    const rootModelFiltered = buildModel(clonedData);

    tree.onModelChange(rootModelFiltered, { isFilteredTree: true });
    tree.updateSelection();

    testState(tree, {
      accumulatedCheckedKeys: expected,
      checkedKeys: expected,
      indeterminateKeys: [],
    });
  });

  it("Выделение элементов при раскрытии 'Показать ещё' в корне списка", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
      isFilteredTree: false,
    });
    tree.onModelChange(rootModelWithShowMore, {});

    tree.handleSelect(undefined, true);
    tree.onModelChange(rootModelExpanded, {});
    tree.updateSelection();

    const checkedState = tree.getCheckedStateDispatchData();
    expect(checkedState.treeCounter?.targetAll).toBe(true);
  });

  it("Раскрытие невыделенного 'Показать ещё' в корне списка", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
      isFilteredTree: false,
    });
    tree.onModelChange(rootModelWithShowMore, {});

    tree.handleSelect(undefined, true);
    tree.handleSelect(undefined, false);
    tree.onModelChange(rootModelExpanded, {});
    tree.updateSelection();

    const checkedState = tree.getCheckedStateDispatchData();
    expect(checkedState.accumulatedKeys).not.toContain("tree_component_model_18");
    expect(checkedState.accumulatedKeys).not.toContain("tree_component_model_19");
  });

  it("'Показать ещё' в отфильтрованном дереве никогда не выделяется", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
    });

    const expected = [
      "tree_component_model_16",
      "tree_component_model_21",
      "tree_component_model_22",
    ];

    tree.onModelChange(rootModel, { isFilteredTree: true });
    tree.handleSelect(tree.getNodeByKey("tree_component_group_6"), true);
    testState(tree, {
      accumulatedCheckedKeys: expected,
      checkedKeys: expected,
      indeterminateKeys: ["tree_component_group_5", "tree_component_group_6"],
    });
  });

  it("Удаление выделения с элементов при удалении самих элементов", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
      isFilteredTree: false,
    });
    tree.onModelChange(rootModel, {});

    const expectedCheckedKeys = [
      "tree_component_model_16",
      "tree_component_model_21",
      "tree_component_model_22",
      "tree_component_group_rest_6_2",
      "tree_component_group_6",
      "tree_component_model_17",
      "tree_component_group_rest_5_2",
      "tree_component_group_5",
    ];

    const expectedAccumulatedKeys = [
      ...expectedCheckedKeys,
      "tree_component_model_7",
      "tree_component_model_8",
    ];

    tree.onModelChange(rootModel, { isFilteredTree: false });
    tree.handleSelect(tree.getNodeByKey("tree_component_group_5"), true);

    const clonedData = cloneDeep(nestedData);
    unset(clonedData, "items[3].items[1]");
    unset(clonedData, "items[3].items[2]");
    const rootModelChanged = buildModel(clonedData);

    tree.onModelChange(rootModelChanged, { isFilteredTree: false });
    tree.updateSelection(true);

    testState(tree, {
      accumulatedCheckedKeys: expectedAccumulatedKeys,
      checkedKeys: expectedCheckedKeys,
      indeterminateKeys: [],
    });
  });

  it("Выделение элементов по умолчанию (defaultCheckedModels)", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
      defaultCheckedModels: [new TreeGroupModel({ struct: { id: 5, __typename: typenameGroup } })],
    });
    tree.onModelChange(rootModel, {});
    tree.updateSelection();

    const expected = [
      "tree_component_group_5",
      "tree_component_model_16",
      "tree_component_model_21",
      "tree_component_model_22",
      "tree_component_group_rest_6_2",
      "tree_component_group_6",
      "tree_component_model_7",
      "tree_component_model_8",
      "tree_component_model_17",
      "tree_component_group_rest_5_2",
    ];

    testState(tree, {
      accumulatedCheckedKeys: expected,
      checkedKeys: expected,
      indeterminateKeys: [],
    });
  });

  it("Получение ключей групп, которые должны быть раскрытыми", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: false,
    });
    tree.onModelChange(rootModel, {});
    const expected = ["tree_component_group_5"];
    tree.handleSelect(tree.getNodeByKey("tree_component_group_6"), true);
    const expandedKeys = tree.defineExpandedKeysForSelected();
    assertContainSameElements(expandedKeys, expected);
  });

  it("Получение ключей групп, которые должны быть раскрытыми при групповом выделении", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
    });
    tree.onModelChange(rootModel, {});
    const expected = ["tree_component_group_5", "tree_component_group_6"];
    tree.handleSelect(tree.getNodeByKey("tree_component_group_5"), true);
    const expandedKeys = tree.defineExpandedKeysForSelected();
    assertContainSameElements(expandedKeys, expected);
  });

  it("Снятое выделение не возвращается к элементу при удалении фильтров [PT-12905]", () => {
    const tree = new TreeManager({
      rowBuilder,
      isCheckable: true,
      isGroupSelection: true,
    });
    tree.onModelChange(rootModel, { isFilteredTree: false });
    tree.updateSelection(true);
    tree.handleSelect(undefined, true);
    tree.onModelChange(rootModel, { isFilteredTree: true });
    tree.updateSelection();
    tree.handleSelect(tree.getNodeByKey("tree_component_model_12"), false);
    tree.onModelChange(rootModel, { isFilteredTree: false });
    tree.updateSelection();

    expect(tree.getCheckedStateDispatchData().keys).not.toContain("tree_component_model_12");
  });
});
