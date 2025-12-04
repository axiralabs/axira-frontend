import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
  type NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

export interface ApolloClientConfig {
  httpEndpoint: string;
  wsEndpoint: string;
  getToken: () => string | null;
  getTenantId: () => string | null;
  getWorkspaceId: () => string | null;
}

export function createApolloClient(config: ApolloClientConfig): ApolloClient<NormalizedCacheObject> {
  const httpLink = createHttpLink({
    uri: config.httpEndpoint,
  });

  const authLink = setContext((_, { headers }) => {
    const token = config.getToken();
    const tenantId = config.getTenantId();
    const workspaceId = config.getWorkspaceId();

    return {
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
        ...(tenantId && { 'x-tenant-id': tenantId }),
        ...(workspaceId && { 'x-workspace-id': workspaceId }),
      },
    };
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: config.wsEndpoint,
      connectionParams: () => {
        const token = config.getToken();
        const tenantId = config.getTenantId();
        const workspaceId = config.getWorkspaceId();

        return {
          ...(token && { authorization: `Bearer ${token}` }),
          ...(tenantId && { 'x-tenant-id': tenantId }),
          ...(workspaceId && { 'x-workspace-id': workspaceId }),
        };
      },
    })
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink)
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            messages: {
              keyArgs: ['episodeId'],
              merge(existing, incoming, { args }) {
                // Cursor-based pagination merge
                if (!existing) return incoming;
                return {
                  ...incoming,
                  edges: [...existing.edges, ...incoming.edges],
                };
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
}
