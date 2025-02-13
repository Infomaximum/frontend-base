import { assertSimple } from "@infomaximum/assert";
import { get, set } from "lodash";

type TDeepRecord<K extends string, T> = K extends `${infer Key}.${infer Rest}`
  ? Record<Key, TDeepRecord<Rest, T>>
  : Record<K, T>;

type TVersion = string | number;
type TVersionPath = string;

interface IObjectMigratorParams<
  V extends TVersion = TVersion,
  P extends TVersionPath = TVersionPath,
  D extends V = V,
> {
  /** Массив версий в строгом порядке, по которому последовательно должна выполняться миграция */
  versions: ReadonlyArray<V>;
  /** Путь до версии в мигрируемой структуре */
  versionPath: P;
  /** Версия по-умолчанию для случаев, когда поле по пути versionPath не задано в структуре */
  defaultVersion?: D;
}

type TMigrateStruct<
  V extends TVersion,
  P extends TVersionPath,
  D extends V | undefined,
> = D extends V ? TDictionary : TDeepRecord<P, V> & TDictionary;

export type TMigrateProcessor<
  V extends TVersion,
  P extends TVersionPath,
  D extends V | undefined,
> = (struct: TMigrateStruct<V, P, D>) => void;

export class ObjectMigrator<
  V extends TVersion = TVersion,
  P extends TVersionPath = TVersionPath,
  D extends V = V,
> {
  /** Массив версий в строгом порядке, по которому последовательно должна выполняться миграция */
  private versions: ReadonlyArray<V>;
  /** Путь до версии в мигрируемой структуре */
  private versionPath: P;
  /** Версия по-умолчанию для случаев, когда поле по пути versionPath не задано в структуре */
  private defaultVersion?: D;

  /** Миграторы по версиям */
  private migrateProcessors = new Map<V, TMigrateProcessor<V, P, D>[]>();

  constructor({ versions, versionPath, defaultVersion }: IObjectMigratorParams<V, P, D>) {
    this.checkVersions(versions);

    this.versions = versions;
    this.versionPath = versionPath;
    this.defaultVersion = defaultVersion;
  }

  private checkVersions(versions: ReadonlyArray<V>) {
    assertSimple(
      versions.length === new Set(versions).size,
      `Набор версий [${versions}] содержит неуникальные элементы!`
    );
  }

  /** Зарегистрировать мигратор на целевую версию */
  public registerProcessor(targetVersion: V, processor: TMigrateProcessor<V, P, D>) {
    const versionProcessors = this.migrateProcessors.get(targetVersion);

    if (versionProcessors) {
      versionProcessors.push(processor);
    } else {
      this.migrateProcessors.set(targetVersion, [processor]);
    }
  }

  /** Получить версию переданной структуры */
  private getCurrentVersion(struct: TMigrateStruct<V, P, D>) {
    const version = get(struct, this.versionPath) ?? this.defaultVersion;

    assertSimple(
      !!version,
      `В структуре не найдено поле "${this.versionPath}" или не передана версия по-умолчанию`
    );

    return version;
  }

  /** Получить набор версий, для миграции */
  private getMigrateVersions(startVersion: V) {
    const startIndex = this.versions.findLastIndex((v) => v === startVersion) + 1;

    assertSimple(!!startIndex, `Версия "${startVersion}" не зарегистрирована для миграции`);

    return this.versions.slice(startIndex);
  }

  /** Запуск процесса миграции по версиям */
  private migrateVersions(struct: TMigrateStruct<V, P, D>, versions: V[]) {
    versions.forEach((version) => {
      const processors = this.migrateProcessors.get(version);

      if (!!processors?.length) {
        processors.forEach((processor) => {
          try {
            processor(struct);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Migration error - ${error}`);
          }
        });
      }

      set(struct, this.versionPath, version);
    }, struct);
  }

  /** Мигрировать структуру до последней актуальной версии (метод мутирует исходную структуру) */
  public migrate(struct: TMigrateStruct<V, P, D>) {
    const currentVersion = this.getCurrentVersion(struct);

    const migrateVersions = this.getMigrateVersions(currentVersion);

    this.migrateVersions(struct, migrateVersions);
  }
}
