import { gql } from '@apollo/client';

export const fragments = {
  // Message fragments
  messageFields: gql`
    fragment MessageFields on Message {
      id
      role
      content
      timestamp
      metadata {
        ...MessageMetadataFields
      }
    }
  `,

  messageMetadataFields: gql`
    fragment MessageMetadataFields on MessageMetadata {
      subjectReferences {
        subjectKey
        subjectKind
        displayName
      }
      planningContext {
        currentStep
        currentAgent
        steps {
          id
          name
          status
          agentId
        }
      }
      structuredResponse {
        summaryItems {
          status
          message
          details
        }
        citations {
          id
          source
          title
          url
          snippet
        }
        availableActions {
          id
          label
          action
          variant
          disabled
        }
      }
      accessDenials {
        resourceId
        reason
      }
    }
  `,

  // Episode fragments
  episodeFields: gql`
    fragment EpisodeFields on Episode {
      id
      title
      createdAt
      updatedAt
      status
      subjectKey
    }
  `,

  // User fragments
  userFields: gql`
    fragment UserFields on User {
      userId
      displayName
      roles
      branch {
        id
        name
      }
    }
  `,

  // Process Agent fragments
  processAgentFields: gql`
    fragment ProcessAgentFields on ProcessAgent {
      id
      name
      description
      version
      status
      createdAt
      updatedAt
      createdBy
    }
  `,

  workflowFields: gql`
    fragment WorkflowFields on Workflow {
      nodes {
        id
        type
        label
        position {
          x
          y
        }
        config
        skillBinding {
          skillId
          parameters
        }
      }
      edges {
        id
        source
        target
        label
        condition
      }
    }
  `,

  // Skill fragments
  skillFields: gql`
    fragment SkillFields on Skill {
      id
      name
      description
      category
      version
      inputSchema
      outputSchema
    }
  `,

  // Evidence fragments
  evidencePackFields: gql`
    fragment EvidencePackFields on EvidencePack {
      id
      caseId
      createdAt
      items {
        id
        type
        source
        content
        timestamp
        citations {
          id
          source
          title
          url
          snippet
        }
      }
    }
  `,
};
