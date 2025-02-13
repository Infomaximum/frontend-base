import { ObjectMigrator } from "./ObjectMigrator";

describe("Тест класса ObjectMigration", () => {
  it("Тестирование получения текущей версии структуры", () => {
    const migrator = new ObjectMigrator({
      versionPath: "version",
      versions: ["1", "2"],
    });
    const migrationStruct = { version: "1" } as const;

    expect(migrator["getCurrentVersion"](migrationStruct)).toBe(migrationStruct.version);
  });

  it("Тестирование получения текущей версии структуры с глубокой вложенностью", () => {
    const migrator = new ObjectMigrator({
      versionPath: "level.sublevel.version",
      versions: ["1", "2"],
    });
    const migrationStruct = { level: { sublevel: { version: "1" } } } as const;

    expect(migrator["getCurrentVersion"](migrationStruct)).toBe(
      migrationStruct.level.sublevel.version
    );
  });

  it("Тестирование получения версии по-умолчанию", () => {
    const migrator = new ObjectMigrator({
      versionPath: "level.sublevel.version",
      versions: ["1", "2"],
      defaultVersion: "1",
    });
    const migrationStruct = { level: { sublevel: {} } };

    expect(migrator["getCurrentVersion"](migrationStruct)).toBe("1");
  });

  it("Тестирование получения списка версий для миграций", () => {
    const migrator = new ObjectMigrator({
      versionPath: "version",
      versions: ["1", "2", "3"],
    });

    expect(migrator["getMigrateVersions"]("1")).toStrictEqual(["2", "3"]);
  });

  it("Тестирование получения списка версий для миграций, когда у структуры последняя версия", () => {
    const migrator = new ObjectMigrator({
      versionPath: "version",
      versions: ["1", "2", "3"],
    });

    expect(migrator["getMigrateVersions"]("3")).toStrictEqual([]);
  });

  it("Тестирование миграции", () => {
    const migrator = new ObjectMigrator({
      versionPath: "version",
      versions: ["1", "2", "3"],
    });
    const migrateStruct = { version: "1" };

    migrator.registerProcessor("2", (struct) => {
      struct.a = "a";
    });

    migrator.registerProcessor("3", (struct) => {
      struct.b = "b";
    });

    migrator.migrate(migrateStruct);
    expect(migrateStruct).toStrictEqual({
      version: "3",
      a: "a",
      b: "b",
    });
  });

  it("Тестирование миграции, если несколько процессоров на одну версию", () => {
    const migrator = new ObjectMigrator({
      versionPath: "version",
      versions: ["1", "2", "3"],
    });
    const migrateStruct = { version: "1" };

    migrator.registerProcessor("2", (struct) => {
      struct.a = "a";
    });

    migrator.registerProcessor("2", (struct) => {
      struct.b = "b";
    });

    migrator.migrate(migrateStruct);
    expect(migrateStruct).toStrictEqual({
      version: "3",
      a: "a",
      b: "b",
    });
  });

  it("Тестирование миграции, если поле с версией переехало", () => {
    const migrator1 = new ObjectMigrator({
      versionPath: "version",
      versions: ["1", "2"],
    });
    const migrator2 = new ObjectMigrator({
      versionPath: "settings.version",
      versions: ["2", "3"],
      defaultVersion: "2",
    });

    const migrateStruct = { version: "1" };

    migrator1.registerProcessor("2", (struct) => {
      struct.a = "a";
    });

    migrator1.migrate(migrateStruct);
    expect(migrateStruct).toStrictEqual({
      version: "2",
      a: "a",
    });

    migrator2.registerProcessor("3", (struct) => {
      delete struct.version;
      struct.settings = { version: "2" };
    });

    migrator2.migrate(migrateStruct);
    expect(migrateStruct).toStrictEqual({
      settings: { version: "3" },
      a: "a",
    });
  });
});
