// Main page
export { WorkSurfacePage } from './WorkSurfacePage';

// Components
export { AxiraGreeting } from './components/AxiraGreeting';
export { CommandInput } from './components/CommandInput';
export { WorkCard, WorkCardList } from './components/WorkCard';
export { ProactiveNudge } from './components/ProactiveNudge';

// Types
export * from './types';

// Mock data (for development)
export {
  MOCK_USER_CONTEXT,
  MOCK_WORK_ITEMS,
  MOCK_PROACTIVE_NUDGE,
  MOCK_QUICK_ACTIONS,
  getContextualGreeting,
} from './data/mockWorkSurface';
