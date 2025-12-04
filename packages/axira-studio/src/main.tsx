import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, TenantProvider } from '@axira/shared/hooks';
import { createApolloClient } from '@axira/shared/graphql';
import { App } from './App';
import './index.css';

const apolloClient = createApolloClient({
  httpEndpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  wsEndpoint: import.meta.env.VITE_GRAPHQL_WS_ENDPOINT || 'ws://localhost:4000/graphql',
  getToken: () => localStorage.getItem('axira_auth_token'),
  getTenantId: () => localStorage.getItem('axira_tenant_id'),
  getWorkspaceId: () => localStorage.getItem('axira_workspace_id'),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <TenantProvider initialOrgId="lsnb-001" initialWorkspaceId="lsnb-main">
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TenantProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
