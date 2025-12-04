// Legacy home page
export { HomePage } from './HomePage';

// Role-specific home pages
export { AxiraHomePage } from './AxiraHomePage';
export { BranchManagerHomePage } from './BranchManagerHomePage';
export { QAReviewerHomePage } from './QAReviewerHomePage';

// Role-based home with persona switcher
export {
  HomePageWithPersonaSwitcher,
  RoleBasedHome,
  RoleBasedHomeProvider,
  PersonaSwitcher,
  useUserRole,
} from './RoleBasedHome';
