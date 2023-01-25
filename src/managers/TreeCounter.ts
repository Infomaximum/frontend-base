import { forEach, isNumber } from "lodash";
import { Group, type IModel } from "@im/models";
import RestModel from "../models/RestModel";

/**
 * Класс, рассчитывающий количество элементов в дереве по разным критериям
 */
class TreeCounter {
  /**
   * Флаг выделения всех элементов
   */
  public targetAll: boolean = false;

  /**
   * Количество выбранных групп
   */
  public groupsCheckedCount: number = 0;

  /**
   * Количество выбранных не групп
   */
  public itemsCheckedCount: number = 0;

  /**
   * Общее количество выбранных элементов
   */
  public totalCheckedCount: number = 0;

  /**
   * Количество выбранных групп, без учёта дочерних групп, по отношению к выбранной
   */
  public groupsCheckedShallowCount: number = 0;

  /**
   * Количество выбранных не групп, без учёта не групп, находящихся внутри выбранной группы
   */
  public itemsCheckedShallowCount: number = 0;

  constructor(models?: IModel[], shellModels?: IModel[], totalCount?: number) {
    if (models && shellModels && isNumber(totalCount)) {
      this.countCheckedEntities(models);
      this.countCheckedShallowEntities(shellModels);

      this.totalCheckedCount = this.itemsCheckedCount + this.groupsCheckedCount;
      this.targetAll =
        totalCount !== 0 && totalCount === this.totalCheckedCount;
    }
  }

  private countCheckedEntities(checkedModels: IModel[]) {
    forEach(checkedModels, (checkedModel) => {
      if (checkedModel instanceof Group) {
        this.groupsCheckedCount += 1;
      } else if (checkedModel instanceof RestModel) {
        this.itemsCheckedCount += checkedModel.getNextCount();
      } else {
        this.itemsCheckedCount += 1;
      }
    });
  }

  private countCheckedShallowEntities(checkedShellModels: IModel[]) {
    forEach(checkedShellModels, (checkedModel) => {
      if (checkedModel instanceof Group) {
        this.groupsCheckedShallowCount += 1;
      } else if (!(checkedModel instanceof RestModel)) {
        this.itemsCheckedShallowCount += 1;
      }
    });
  }
}

export default TreeCounter;
