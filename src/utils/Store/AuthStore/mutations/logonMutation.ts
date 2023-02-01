import { graphqlTag } from "@im/utils";

export const logonMutation = graphqlTag`
  mutation LogonMutation($login: String!, $passwordHash: String!) {
    logon(login: $login, password_hash: $passwordHash) {
      status
      uuid
      employee {
        id
      }
    }
  }
`;
