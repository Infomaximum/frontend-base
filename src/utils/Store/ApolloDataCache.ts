/* eslint-disable @typescript-eslint/no-this-alias */
import { find, isNil } from "lodash";
import { type NStore } from "./Store/Store.types";
import {
  type DocumentNode,
  type SelectionNode,
  type OperationDefinitionNode,
  type FragmentDefinitionNode,
  type FieldNode,
  Kind,
} from "graphql";
import type { TModelStruct } from "@infomaximum/graphql-model";
import { assertSilent, assertSimple } from "@infomaximum/assert";
import { apolloInstance } from "./Apollo";
import { getFragmentDefinitions, getQueryDefinition } from "@apollo/client/utilities";

/** Класс работы с кэшем Apollo, для возможности использованиях в store */
export class ApolloDataCache implements NStore.IDataCache {
  private getSelectionNodeByPath(queryDefinition: OperationDefinitionNode, dataPath: string = "") {
    let selectionNode: FieldNode | OperationDefinitionNode = queryDefinition;

    return !dataPath.split(".").some((level) => {
      const levelNode = find(
        selectionNode.selectionSet?.selections,
        (selection: FieldNode) => selection.name.value === level
      );

      if (!levelNode) {
        assertSilent(false, "Некорректный dataPath запроса");
        return true;
      }

      selectionNode = levelNode as FieldNode;
    })
      ? selectionNode
      : null;
  }

  private getExpandedNode(
    fieldNode: FieldNode | OperationDefinitionNode | FragmentDefinitionNode,
    queryFragmentDefinitions: Map<string, FragmentDefinitionNode>
  ) {
    const selections: SelectionNode[] = [];

    fieldNode.selectionSet?.selections.forEach((s) => {
      switch (s.kind) {
        case Kind.FIELD:
          if (s.selectionSet) {
            selections.push(this.getExpandedNode(s, queryFragmentDefinitions) as FieldNode);
          } else {
            selections.push(s);
          }

          break;
        case Kind.FRAGMENT_SPREAD:
          const fragment = queryFragmentDefinitions?.get(s.name.value) as FragmentDefinitionNode;

          if (!fragment) {
            assertSimple(false, `Фрагмент "${s.name.value}" не найден`);
          }

          selections.push(
            ...(this.getExpandedNode(fragment, queryFragmentDefinitions).selectionSet?.selections ||
              [])
          );
          break;
      }
    });

    return {
      ...fieldNode,
      selectionSet: {
        kind: Kind.SELECTION_SET,
        selections,
      },
    };
  }

  private getFragmentTypename(
    selectionNode: OperationDefinitionNode,
    fragmentMap: Map<string, FragmentDefinitionNode>
  ): string | undefined {
    let typename: string | undefined;
    selectionNode.selectionSet.selections.forEach((s) => {
      if (s.kind === Kind.FRAGMENT_SPREAD) {
        const fragment = fragmentMap.get(s.name.value);
        typename = fragment?.typeCondition.name.value;
      }
    });

    return typename;
  }

  /** Возвращает фрагмент и его typename для получения данных из кэша по dataPath */
  private getFragment(
    query: DocumentNode,
    dataPath?: string
  ): { fragment: DocumentNode; typename: string } | null {
    const queryDefinition = getQueryDefinition(query);
    const fragmentDefinitions = getFragmentDefinitions(query);
    const fragmentMap = new Map<string, FragmentDefinitionNode>();
    fragmentDefinitions.forEach((f) => {
      fragmentMap.set(f.name.value, f);
    });

    const entitySelectionNode = this.getSelectionNodeByPath(queryDefinition, dataPath);
    if (!entitySelectionNode) {
      return null;
    }

    const fragmentTypename = this.getFragmentTypename(entitySelectionNode, fragmentMap);
    if (!fragmentTypename) {
      return null;
    }

    const fragmentNode = this.getExpandedNode(entitySelectionNode, fragmentMap);
    if (!fragmentNode) {
      return null;
    }

    const fragmentDefinition = {
      kind: Kind.FRAGMENT_DEFINITION as const,
      selectionSet: fragmentNode.selectionSet,
      directives: [],
      name: {
        kind: Kind.NAME as const,
        value: "EntityFragment",
      },
      typeCondition: {
        kind: Kind.NAMED_TYPE as const,
        name: {
          kind: Kind.NAME as const,
          value: fragmentTypename,
        },
      },
    };

    return {
      fragment: {
        kind: Kind.DOCUMENT,
        definitions: [fragmentDefinition],
      } as DocumentNode,
      typename: fragmentTypename,
    };
  }

  /** Получение данных из кэша по данным запроса */
  public getData({
    query,
    dataPath,
    variables,
  }: {
    query: DocumentNode;
    variables: TDictionary;
    dataPath?: string;
  }): TModelStruct | null {
    const id = variables?.id || variables?.guid;
    if (isNil(id)) {
      return null;
    }

    const fragmentData = this.getFragment(query, dataPath);

    if (!fragmentData) {
      return null;
    }

    const { fragment, typename } = fragmentData;

    return apolloInstance.apolloClient.cache.readFragment({
      fragment,
      id: apolloInstance.getCacheKey(typename, id),
      returnPartialData: true,
      variables,
    }) as TModelStruct;
  }
}
