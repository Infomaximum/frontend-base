import { TypenameToModel } from "@im/models";

/**
 * Экземпляр класса TypenameToModel
 * Служит для хранения и поиска модели по соответствующему typename
 * Добавлять typename необходимо в статику модели
 *
 * @example
 * class Position extends Model {
 *   public static override get typename() {
 *    return "position";
 *   }
 *
 *   public getName(): string | undefined {
 *    return this.getStringField("name");
 *   }
 * }
 *
 * export default Position
 *
 */
const typenameToModel = new TypenameToModel();

export default typenameToModel;
