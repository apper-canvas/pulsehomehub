import { propertyService } from './api/propertyService';
import { savedPropertyService } from './api/savedPropertyService';

// Helper function for delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export {
  propertyService,
  savedPropertyService
};