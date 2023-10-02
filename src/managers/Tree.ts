import { forEach, map, includes, filter, reduce, every, isEmpty, get, isUndefined } from "lodash";
import { runDfs } from "@infomaximum/utility";
import { TreeCounter } from "./TreeCounter";
import type { NTableStore } from "../utils/Store/TableStore/TableStore.types";
import { RestModel } from "../models/RestModel";
import { Group, type IModel, type Model } from "@infomaximum/graphql-model";
import { assertSimple } from "@infomaximum/assert";

export type TBaseRow = {
  key: string;
  name?: string;
  model?: IModel;
};

export type TExtendColumns<T> = T & { children?: TExtendColumns<T>[] };

type TModelsMap = Map<string, IModel>;

export interface ITreeModel extends IModel {
  getParents(): ITreeModel[];
}

/** Методы добавления новой строки в таблицу*/
export enum EAddingRowMethod {
  /** добавление строки в начало таблицы */
  UNSHIFT = "UNSHIFT",
  /** добавление строки в конец таблицы */
  PUSH = "PUSH",
}

type TModelUpdateParams<T extends TBaseRow = TBaseRow> = {
  isFilteredTree: boolean;
  addedRow: TExtendColumns<T>;
  /** @see подробнее => {@link EAddingRowMethod } */
  addingRowMethod: EAddingRowMethod;
};

/*
 * Приходящие с сервера hidden элементы - элементы, которые выделены,
 * но не соответствуют поисковому запросу или фильтру.
 *
 * todo:
 * при выделении всего дерева и переходе в поиск, если в поиске есть "Показать еще", шапка
 * не выделяется галочкой. Это связано с тем, что выделять "Показать еще" в поиске нет смысла и
 * приведет к усложнению логики.
 */

export class TreeManager<T extends TBaseRow = TBaseRow> {
  // дерево, подготовленное для таблицы Ant
  public preparedTreeData: TExtendColumns<T>[] = [];

  // счетчик выделенных элементов
  public treeCounter: TreeCounter = new TreeCounter();

  // выделенные ключи, которые есть в текущем дереве
  private checkedKeys!: string[];

  // выделенные модели, которые есть в текущем дереве
  private checkedModels!: IModel[];
  private checkedShellModels!: IModel[];

  // ключи всех выделенных элементов
  private accumulatedCheckedKeys!: string[];

  private rowBuilder!: (model: IModel) => T;

  // коллекция всех моделей, к которым можно обратиться
  private modelsMap: TModelsMap = new Map();

  // модель корневой группы
  private treeModel: Group | null = null;

  // все элементы подготовленного дерева в плоском виде, но с полем children
  private treeNodesMap: Map<string, TExtendColumns<T>> = new Map();

  // ключи отфильтрованного дерева без групп и rest
  private filteredTreeItemsKeys: string[] = [];

  // количество узлов дерева без фильтрации
  private sourceTreeNodesLength: number = 0;

  // Коллекция ключей текущего дерева данных
  private currentDataKeysSet: Set<string> = new Set();

  // rest ключи неотфильтрованного дерева
  private restKeysSet: Set<string> = new Set();

  // rest модели по ключам их групп
  private restByGroupMap: Map<string, RestModel> = new Map();

  // флаг того, что дерево пришло во время поиска или при применении фильтров
  private isFilteredTree: boolean = false;

  // содержат ли серверные данные always_coming_data.
  private hasAlwaysComingData: boolean = false;

  // Ключи групп с состоянием indeterminate
  private indeterminateGroupsKeys: Set<string> = new Set();

  // включено ли выделение вложенных элементов при выделении группы
  private isGroupSelection: boolean;

  // ключи элементов, которые не должны попасть в дерево
  private erasedKeys: string[] | null;

  // поддерживает ли компонент с деревом выделение.
  private isCheckable: boolean;

  // ключи групп и "показать ещё", с которых должно исчезнуть выделение при фильтрации или поиске
  private nonSelectableGroupAndRestKeysSet: Set<string> = new Set();

  constructor({
    defaultCheckedModels,
    isGroupSelection = false,
    erasedKeys = null,
    isFilteredTree = false,
    isCheckable = false,
    rowBuilder,
  }: {
    defaultCheckedModels?: IModel[];
    isGroupSelection?: boolean;
    erasedKeys?: string[] | null;
    isFilteredTree?: boolean;
    isCheckable?: boolean;
    rowBuilder: (model: IModel) => T;
  }) {
    this.isGroupSelection = isGroupSelection;
    this.erasedKeys = erasedKeys;
    this.isCheckable = isCheckable;

    this.setRowBuilder(rowBuilder);
    this.onModelChange(null, { isFilteredTree });

    if (!isEmpty(defaultCheckedModels)) {
      this.updateModelsMap(defaultCheckedModels);
      this.accumulatedCheckedKeys = this.getModelsKeys(defaultCheckedModels);
      this.updateCheckedState(new Set(this.accumulatedCheckedKeys));
    }
  }

  public setRowBuilder(rowBuilder: (model: IModel) => T) {
    this.rowBuilder = rowBuilder;
  }

  /**
   * Обновляет состояние Tree. Вызывается при получении новых данных с сервера.
   */
  public onModelChange(
    treeModel: Group | null,
    {
      isFilteredTree = false,
      addedRow,
      addingRowMethod = EAddingRowMethod.UNSHIFT,
    }: Partial<TModelUpdateParams<T>>
  ) {
    this.treeModel = treeModel || null;
    const treeModelItems = treeModel ? treeModel.getItems() : [];

    // когда приходит хотя бы 1 элемент, смотрим, имеет ли он флаг hidden и запоминаем
    if (!isEmpty(treeModelItems) && !this.hasAlwaysComingData) {
      this.hasAlwaysComingData = !isUndefined(get(treeModelItems[0], "struct.hidden"));
    }

    const addedRows = addedRow ? [addedRow] : [];

    if (addingRowMethod === EAddingRowMethod.UNSHIFT) {
      this.preparedTreeData = [...addedRows, ...this.buildRows(treeModelItems)];
    } else if (addingRowMethod === EAddingRowMethod.PUSH) {
      this.preparedTreeData = [...this.buildRows(treeModelItems), ...addedRows];
    } else {
      assertSimple(false, `${addingRowMethod} не обработан`);
    }

    this.isFilteredTree = isFilteredTree;

    if (this.isCheckable) {
      const plainTreeNodes = this.getPlainTreeNodes(this.preparedTreeData);
      this.treeNodesMap = new Map(map(plainTreeNodes, (node) => [node.key, node]));
      this.currentDataKeysSet = new Set();
      this.filteredTreeItemsKeys = [];
      this.nonSelectableGroupAndRestKeysSet = new Set();

      if (!isFilteredTree) {
        this.restKeysSet = new Set();
        this.restByGroupMap = new Map();
        this.sourceTreeNodesLength = this.treeNodesMap.size;
      }

      const plainModels = this.getNestedModels(treeModelItems);
      // заполняем коллекции, используемые при обработке чекбоксов
      forEach(plainModels, (model) => {
        const key = model.getInnerName();
        this.currentDataKeysSet.add(key);

        if (isFilteredTree) {
          if (model instanceof RestModel || (model instanceof Group && !model.isSelected)) {
            this.nonSelectableGroupAndRestKeysSet.add(key);
          } else {
            if (!(model instanceof Group)) {
              this.filteredTreeItemsKeys.push(key);
            }
          }
        } else {
          if (model instanceof RestModel) {
            this.restKeysSet.add(key);

            const groupKey = model.getParentModel()?.getInnerName();
            groupKey && this.restByGroupMap.set(groupKey, model);
          }
        }
      });

      this.updateModelsMap(plainModels);
    }
  }

  /**
   * Проверяет, находится ли узел дерева в indeterminate состоянии.
   */
  public isCheckIndeterminate(treeNode: T): boolean {
    return this.indeterminateGroupsKeys.has(treeNode.key);
  }

  /**
   * Обновляет выделение элементов при обновлении данных:
   * - удаляет выделение, которое стало неактуальным
   * - выделяет дочерние элементы внутри выделенных родителей
   */
  public updateSelection(isInitiation: boolean = false) {
    assertSimple(this.isCheckable, "Нельзя обновить выделение у компонента без чекбоксов");

    const removableKeys: string[] = [];
    const removableRestKeys: string[] = [];

    // Флаг, показывающий, являлось ли удаление триггером загрузки новых данных
    let hasLostChecks: boolean = false;

    if (!isInitiation) {
      // Удаляем rest, которые были выделены, но пропали при их раскрытии
      if (!this.isFilteredTree) {
        forEach(this.accumulatedCheckedKeys, (checkedKey) => {
          const model = this.modelsMap.get(checkedKey);

          if (model instanceof RestModel && !this.restKeysSet.has(checkedKey)) {
            removableRestKeys.push(checkedKey);
          }
        });
      }

      if (this.hasAlwaysComingData) {
        // если какого-либо выделенного ключа нет в текущих данных, удаляем его, но rest не трогаем
        forEach(this.accumulatedCheckedKeys, (checkedKey) => {
          if (!this.currentDataKeysSet.has(checkedKey) && !this.restKeysSet.has(checkedKey)) {
            removableKeys.push(checkedKey);
            // обязательно нужно проверить, был ли ключ уже удален на предыдущем шаге,
            // т.к. предыдущий шаг не должен влиять на hasLostChecks
            if (!hasLostChecks && !includes(removableRestKeys, checkedKey)) {
              hasLostChecks = true;
            }
          }
        });
      }

      removableKeys.push(...removableRestKeys, ...this.nonSelectableGroupAndRestKeysSet);
    }

    const addedKeys: string[] = [];

    if (this.treeCounter.targetAll && !hasLostChecks) {
      // если пришел флаг, что должны быть выделены все
      addedKeys.push(...this.treeNodesMap.keys());
    } else if (this.isGroupSelection) {
      // выделяем дочерние элементы в выделенных группах
      forEach(this.accumulatedCheckedKeys, (key) => {
        const node = this.treeNodesMap.get(key);

        if (!(node?.model instanceof Group)) {
          return;
        }

        const [childrenNodes, filteredChildrenNodes] = this.getChildrenNodes(node);
        const actualChildrenNodes = this.isFilteredTree ? filteredChildrenNodes : childrenNodes;
        const childrenKeys = map(actualChildrenNodes, (node) => node.key);

        addedKeys.push(...childrenKeys);
      });
    }

    const checkedKeysSet = new Set(this.accumulatedCheckedKeys);
    const resultKeysSet = this.mergeKeysWithSet(checkedKeysSet, addedKeys, removableKeys);

    this.updateCheckedState(resultKeysSet);
  }

  // Для тестирования
  public getNodeByKey(key: string) {
    return this.treeNodesMap.get(key);
  }

  // Для тестирования
  public getNodesKeys() {
    return [...this.treeNodesMap.keys()];
  }

  private updateCheckedState(accumulatedCheckedKeysSet: Set<string>) {
    this.updateIndeterminateGroupsKeys(accumulatedCheckedKeysSet);

    this.accumulatedCheckedKeys = [...accumulatedCheckedKeysSet.values()];

    this.checkedKeys = [];

    forEach(this.accumulatedCheckedKeys, (key) => {
      this.treeNodesMap.has(key) && this.checkedKeys.push(key);
    });

    this.checkedModels = this.getModelsByKeys(this.checkedKeys);
    this.checkedShellModels = this.isGroupSelection
      ? this.removeContradictions(this.checkedModels)
      : this.checkedModels;

    const sourceTreeRestModels = [...this.restByGroupMap.values()];

    const restCount = reduce(
      sourceTreeRestModels,
      (sum, model) => {
        return sum + (model?.getNextCount() ?? 0);
      },
      0
    );

    const totalCount = this.sourceTreeNodesLength - sourceTreeRestModels.length + restCount;

    this.treeCounter = new TreeCounter(this.checkedModels, this.checkedShellModels, totalCount);
  }

  /**
   * Возвращает данные для обновления checkedState.
   */
  public getCheckedStateDispatchData() {
    const {
      treeCounter,
      accumulatedCheckedKeys: accumulatedKeys,
      checkedKeys: keys,
      checkedModels: models,
      checkedShellModels: shellModels,
    } = this;

    return {
      keys,
      models,
      accumulatedKeys,
      accumulatedModels: this.getModelsByKeys(accumulatedKeys),
      shellModels,
      shellKeys: this.isGroupSelection ? this.getModelsKeys(shellModels) : keys,
      treeCounter,
    } as NTableStore.TCheckedRows;
  }

  public clearSelection() {
    this.updateCheckedState(new Set([]));
  }

  public handleSelect(
    targetTreeNode: TExtendColumns<T> | undefined,
    userSelectAction: boolean,
    selectionType?: string,
    blockedRowKeys?: string[]
  ) {
    assertSimple(this.isCheckable, "Нельзя обновить выделение у компонента без чекбоксов");

    if (selectionType === "radio") {
      targetTreeNode && this.updateCheckedState(new Set([targetTreeNode.key]));
      return;
    }

    let addedKeys: string[] = [];
    let removableKeys: string[] = [];

    const checkedKeysSet = new Set(this.accumulatedCheckedKeys);

    forEach(blockedRowKeys, (key) => {
      checkedKeysSet.add(key);
    });

    if (targetTreeNode) {
      if (this.isGroupSelection) {
        let interpretedSelectAction = userSelectAction;

        if (targetTreeNode.model instanceof Group) {
          const [childrenNodes, filteredChildrenNodes] = this.getChildrenNodes(targetTreeNode);
          const filteredChildrenNodesKeys = map(filteredChildrenNodes, (node) => node.key);

          const isAllChildrenChecked =
            this.isAllChecked(filteredChildrenNodesKeys, checkedKeysSet) &&
            this.isGroupWithChild(targetTreeNode.model);

          // инвертирование выделения, если щелкаем по группе со всеми выделенными детьми
          interpretedSelectAction =
            isAllChildrenChecked && userSelectAction ? !userSelectAction : userSelectAction;

          if (this.isFilteredTree) {
            if (interpretedSelectAction) {
              // в отфильтрованное дерево добавляем отфильтрованные ключи
              addedKeys.push(...filteredChildrenNodesKeys);
            } else {
              const childrenNodesKeys = map(childrenNodes, (node) => node.key);
              removableKeys.push(...childrenNodesKeys);
            }
          } else {
            if (isAllChildrenChecked && !userSelectAction) {
              removableKeys.push(targetTreeNode.key);
              const groupRest = this.restByGroupMap.get(targetTreeNode.key);

              if (groupRest) {
                removableKeys.push(groupRest.getInnerName());
              }
            } else {
              const childrenNodesKeys = map(childrenNodes, (node) => node.key);

              if (interpretedSelectAction) {
                addedKeys.push(...childrenNodesKeys);
              } else {
                removableKeys.push(...childrenNodesKeys);
              }
            }
          }
        }

        if (interpretedSelectAction) {
          // нельзя выделить группу в отфильтрованном дереве
          if (!(this.isFilteredTree && this.isGroupWithChild(targetTreeNode.model))) {
            addedKeys.push(targetTreeNode.key);
          }
        } else {
          removableKeys.push(targetTreeNode.key);
          // абсолютно всегда при снятии выделения удаляем родительские ключи с их rest
          removableKeys.push(...this.getParentsRemovedKeys(targetTreeNode));
        }
      } else {
        // если отключено групповое выделение, логика проста
        if (userSelectAction) {
          addedKeys = [targetTreeNode.key];
        } else {
          removableKeys = [targetTreeNode.key, ...this.restKeysSet.keys()];
        }
      }
      // При клике по шапке
    } else {
      if (this.isFilteredTree) {
        if (
          !userSelectAction ||
          (userSelectAction && this.isAllChecked(this.filteredTreeItemsKeys, checkedKeysSet))
        ) {
          removableKeys = [...this.treeNodesMap.keys(), ...this.restKeysSet.keys()];
        } else {
          addedKeys = this.filteredTreeItemsKeys;
        }
      } else {
        const treeRootKeys = map(this.preparedTreeData, (node) => node.key);
        const rootRestKey = this.sourceTreeRootRestKey;

        // ключи дерева без корневого rest
        const treeKeysWithoutRootRest = rootRestKey
          ? treeRootKeys.slice(0, treeRootKeys.length - 1)
          : treeRootKeys;

        // Условие выделения всего дерева, но не включая корневой rest.
        const fullSelectionConditionWithoutRootRest = this.isAllChecked(
          treeKeysWithoutRootRest,
          checkedKeysSet
        );
        // Условие выделения всего дерева, включая корневой rest.
        const fullSelectionCondition = rootRestKey
          ? checkedKeysSet.has(rootRestKey)
          : fullSelectionConditionWithoutRootRest;

        // Если кликаем по шапке с чеком.
        if (!userSelectAction && fullSelectionCondition) {
          if (rootRestKey) {
            removableKeys = [rootRestKey];
          } else {
            removableKeys = [...this.treeNodesMap.keys()];
          }
          // Два условия ниже - клик по шапке без чека.
        } else if (userSelectAction && fullSelectionConditionWithoutRootRest) {
          // удаляем вообще все
          removableKeys = [...this.accumulatedCheckedKeys];
        } else {
          addedKeys = [...this.treeNodesMap.keys()];
          if (!this.isGroupSelection) {
            removableKeys = [...this.restKeysSet.values()];
          }
        }
      }
    }

    const resultKeysSet = this.mergeKeysWithSet(
      checkedKeysSet,
      addedKeys,
      removableKeys,
      blockedRowKeys
    );
    this.updateCheckedState(resultKeysSet);
  }

  public defineExpandedKeysForSelected() {
    const parentsNames = new Set<string>();
    const { checkedModels } = this;

    forEach(checkedModels, (model: ITreeModel) => {
      if (!(model instanceof RestModel)) {
        forEach(model.getParents(), (parent: IModel) => {
          parentsNames.add(parent.getInnerName());
        });
      }
    });
    return Array.from(parentsNames.values());
  }

  public defineExpandedKeysForFound() {
    const getModelItems = (model: Group) => model.getItems();
    const isModelExpanded = (model: Model) => !model.isSelected() && model instanceof Group;
    const getInnerName = (model: Model) => model.getInnerName();

    return runDfs(this.treeModel, getModelItems, isModelExpanded, getInnerName) as string[];
  }

  private get sourceTreeRootRestKey(): string | undefined {
    const rootDepartmentKey = this.treeModel?.getInnerName();

    return rootDepartmentKey && this.restByGroupMap.get(rootDepartmentKey)?.getInnerName();
  }

  /**
   * Добавляет в коллекцию моделей модели из переданного массива.
   */
  private updateModelsMap(models: IModel[] | undefined) {
    // модели, которые находятся правее в списке, перезапишут предыдущие.
    forEach(models, (model) => {
      this.modelsMap.set(model.getInnerName(), model);
    });
  }

  /**
   * Мутирует и возвращает Set по переданным ключам.
   */
  private mergeKeysWithSet(
    targetSet: Set<string>,
    addedKeys: string[],
    removableKeys: string[] = [],
    blockedRowKeys?: string[]
  ): Set<string> {
    forEach(blockedRowKeys, (key) => {
      removableKeys.push(key);
    });

    forEach(addedKeys, (key) => {
      targetSet.add(key);
    });

    forEach(removableKeys, (key) => {
      targetSet.delete(key);
    });

    return targetSet;
  }

  /**
   *  Возвращает ключи удаляемых родителей и rest ключи этих родителей
   */
  private getParentsRemovedKeys(targetTreeNode: TExtendColumns<T>): string[] {
    const removedKeys = [];
    const parentsKeys = map(
      (targetTreeNode.model as unknown as { getParents(): any[] })?.getParents(),
      (model) => model.getInnerName()
    );
    removedKeys.push(...parentsKeys, this.sourceTreeRootRestKey);
    removedKeys.push(...this.getRestKeysByGroups(parentsKeys));

    return removedKeys;
  }

  private getRestKeysByGroups(keys: string[]): string[] {
    const restKeys: string[] = [];

    forEach(keys, (key) => {
      const restKey = this.restByGroupMap.get(key)?.getInnerName();

      restKey && restKeys.push(restKey);
    });

    return restKeys;
  }

  /**
   * Возвращает ключи по моделям
   */
  private getModelsKeys(models: IModel[] | undefined): string[] {
    return map(models, (model) => model.getInnerName());
  }

  /**
   * Возвращает модели по ключам.
   */
  private getModelsByKeys(keys: string[]): IModel[] {
    return reduce(
      keys,
      (accum: IModel[], key) => {
        const model = this.modelsMap.get(key);
        model && accum.push(model);
        return accum;
      },
      []
    );
  }

  /**
   * Проверка, является ли модель непустой группой. Это имеет значение,
   * т.к. в отфильтрованном дереве неизвестно содержимое групп.
   */
  private isGroupWithChild(model: IModel | undefined): boolean {
    return model instanceof Group && !isEmpty(model.getItems());
  }

  /**
   * Возвращает в плоском виде дочерние узлы
   */
  private getChildrenNodes(
    treeNode: TExtendColumns<T>
  ): [TExtendColumns<T>[], TExtendColumns<T>[]] {
    const plainTreeNode = this.getPlainTreeNodes([treeNode]);
    const childrenNodes = plainTreeNode.slice(0, plainTreeNode.length - 1);

    const filteredChildrenNodes = filter(childrenNodes, (child) => {
      if (this.isFilteredTree && this.isGroupWithChild(child.model)) {
        return false;
      }
      return !(child.model instanceof RestModel);
    });

    return [childrenNodes, filteredChildrenNodes];
  }

  private isAllChecked(keys: string[], checkedKeysSet: Set<string>) {
    return every(keys, (key) => checkedKeysSet.has(key));
  }

  /**
   * Обновляет список групп, имеющих состояние "indeterminate".
   */
  private updateIndeterminateGroupsKeys(checkedKeysSet: Set<string>) {
    const indeterminateGroupsKeys: string[] = [];

    const pushIndeterminateGroups = (models: IModel[], parentsKeys: string[] = []) => {
      let isParentIndeterminate = false;

      for (let i = 0; i < models.length; i += 1) {
        const model = models[i];

        if (!model) {
          continue;
        }

        if (isParentIndeterminate && !(model instanceof Group)) {
          continue;
        }

        const key = model.getInnerName();
        const isSelected = checkedKeysSet.has(key);

        // если элемент выделен - значит все его родители "indeterminate"
        if (!isParentIndeterminate && isSelected) {
          isParentIndeterminate = true;
          indeterminateGroupsKeys.push(...parentsKeys);
        }
        // не имеет смысла проверять состояние "indeterminate" у детей выделенных родителей
        if (model instanceof Group && !isSelected) {
          pushIndeterminateGroups(model.getItems(), [...parentsKeys, key]);
        }
      }
    };

    this.treeModel && pushIndeterminateGroups(this.treeModel.getItems());
    this.indeterminateGroupsKeys = new Set(indeterminateGroupsKeys);
  }

  /**
   * Возвращает одномерный массив из самого элемента и eго дочерних элементов по всей вложенности.
   */
  private getPlainTreeNodes(
    treeNodes: TExtendColumns<T>[],
    plainNodes: TExtendColumns<T>[] = []
  ): TExtendColumns<T>[] {
    forEach(treeNodes, (treeNode) => {
      if (treeNode.children) {
        this.getPlainTreeNodes(treeNode.children, plainNodes);
      }

      plainNodes.push(treeNode);
    });

    return plainNodes;
  }

  /**
   * Метод,который удаляет у выделенных элементов вложенные.
   */
  private removeContradictions(models: IModel[]): IModel[] {
    // создаем коллекцию моделей по их ключам
    const modelsMap = new Map(map(models, (model) => [model.getInnerName(), model]));

    // Если дочерние элементы модели уже есть в списке, удаляем их

    forEach(models, (model) => {
      if (model instanceof Group) {
        const children = model.getItems();

        forEach(children, (child) => {
          const key = child.getInnerName();

          if (modelsMap.has(key)) {
            modelsMap.delete(key);
          }
        });
      }
    });

    return [...modelsMap.values()];
  }

  /**
   * Строит подготовленное для таблицы Ant дерево с заполненными полями
   * из сырого дерева, построенного в graphqlTree.storeExt
   */
  private buildRows(models: IModel[]): TExtendColumns<T>[] {
    const rows: TExtendColumns<T>[] = [];

    forEach(models, (model) => {
      if (model instanceof RestModel) {
        (rows as TExtendColumns<any>[]).push({
          model,
          key: model.getInnerName(),
        });
      } else {
        let isHidden: boolean = false;

        if (this.hasAlwaysComingData) {
          const _model = model as IModel & { isHidden(): boolean };

          if (_model.isHidden) {
            isHidden = _model.isHidden() === true;
          } else {
            assertSimple(
              false,
              "Модель, содержащаяся в данных с always_coming_data, должна иметь метод isHidden"
            );
          }
        }

        const isErased = this.erasedKeys && includes(this.erasedKeys, model.getInnerName());

        if (!(isErased || isHidden)) {
          const row = { ...this.rowBuilder(model) } as TExtendColumns<T>;

          if (model instanceof Group) {
            const groupItems = model.getItems();

            if (groupItems.length > 0) {
              row.children = this.buildRows(groupItems);
            }
          }

          rows.push(row);
        }
      }
    });

    return rows;
  }

  /**
   * Возвращает все вложенные модели от модели дерева.
   */
  private getNestedModels(models: IModel[]): IModel[] {
    const currentModels: IModel[] = [];

    forEach(models, (model) => {
      currentModels.push(model);
      if (model instanceof Group) {
        currentModels.push(...this.getNestedModels(model.getItems()));
      }
    });

    return currentModels;
  }
}
