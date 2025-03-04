import { assertSimple } from "@infomaximum/assert";
import { type IModel, type IModelParams, Model } from "@infomaximum/graphql-model";

import { typenameToModel } from "./typenameToModel";

interface IRestParams extends IModelParams {
  parent: IModel;
}

export class RestModel extends Model {
  public static override get typename() {
    return "rest";
  }

  constructor(params: IRestParams) {
    assertSimple(!!params.parent, "Не задана родительская модель для RestModel модели!");
    super(params);
  }

  /**
   * Возвращает ID RestModel модели. Равен ID родительской модели.
   * @returns {number} ID RestModel модели
   */
  public override getId(): number {
    return this.parent?.getId() as number;
  }

  /**
   * Возвращает typename RestModel модели.
   * @returns {string} typename
   */
  public override getTypename(): string {
    return `${this.parent?.getTypename()}_rest`;
  }

  public override getInnerName(): string {
    return `${this.getTypename()}_${this.getId()}`;
  }
}

typenameToModel.registrationModels([RestModel]);
