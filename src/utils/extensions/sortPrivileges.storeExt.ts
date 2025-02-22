import { sortBy, find, reverse } from "lodash";
import { Expander } from "@infomaximum/module-expander";
import type { NStore } from "../Store/Store/Store.types";
import type { Store } from "../Store/Store/Store";
import type { Model } from "@infomaximum/graphql-model";

export const sortPrivilegesExt: NStore.TPrepareDataFunc<Store<Model>> = ({ data }) => {
  const { featureList, featureGroupList } = Expander.getInstance().getFeaturesConfig();

  if (data) {
    const privileges = data.privileges;

    data.privileges = reverse(
      sortBy(privileges, [
        function (privilege) {
          const groupConf = find(featureGroupList, (featureGroup) => {
            const key: string = privilege.key;
            const groupName =
              key && key.indexOf(".") >= 0 ? key.substring(0, key.indexOf(".")) : key;

            return featureGroup.name === groupName;
          });

          const sortedPrivilege = find(featureList, (feature) => feature.name === privilege.key);

          return (groupConf?.priority || 0) + (sortedPrivilege?.priority || 0);
        },
      ])
    );
  }

  return data;
};
