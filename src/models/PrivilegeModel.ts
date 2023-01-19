import type { EOperationType } from "@im/utils";
import { Model } from "@im/utils";
import { find } from "lodash";

/**
 * Модель привилегий
 */
class PrivilegeModel extends Model {
  public static override get typename() {
    return "out_privilege";
  }

  /**
   * Возвращает код привилегии
   * @returns {string} код привилегии
   */
  public getKey(): string | undefined {
    return this.getStringField("key");
  }

  /**
   * Возвращает список операций для данной привилегии
   * @returns {Array<EOperationType>} список операций
   */
  public getOperations(): EOperationType[] {
    return this.getEnumField<EOperationType>("operations");
  }

  /**
   * Возвращает список доступных операций для данной привилегии
   * @returns {Array<EOperationType>} список операций
   */
  public getAvailableOperations(): EOperationType[] {
    return this.getEnumField<EOperationType>("available_operations");
  }

  /** Метод проверки есть ли операция в списке доступных,
   * для понимания рисовать ли чекбокс.
   */
  public getAvailableOperationByOperation(operation: EOperationType) {
    return find(this.getAvailableOperations(), (oper: string) => oper === operation);
  }

  /** Метод проверки есть ли операция в списке активных, чтобы понять
   * чекнутый ли должен быть чекбокс
   */
  public isActiveOperation(operation: EOperationType) {
    return find(this.getOperations(), (oper: string) => oper === operation);
  }
}

export default PrivilegeModel;
