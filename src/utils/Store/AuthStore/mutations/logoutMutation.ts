import { graphqlTag } from "@im/utils";

export const logoutMutation = graphqlTag`
  mutation LogoutMutation {
    logout
  }
`;
