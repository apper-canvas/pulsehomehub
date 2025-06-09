import { delay } from '../index';

// Import mock data
import savedPropertiesData from '../mockData/savedProperties.json';

let savedProperties = [...savedPropertiesData];

export const savedPropertyService = {
  async getAll() {
    await delay(200);
    return [...savedProperties];
  },

  async getById(propertyId) {
    await delay(150);
    const saved = savedProperties.find(s => s.propertyId === propertyId);
    if (!saved) {
      throw new Error('Saved property not found');
    }
    return { ...saved };
  },

  async create(savedData) {
    await delay(300);
    // Check if already saved
    const existing = savedProperties.find(s => s.propertyId === savedData.propertyId);
    if (existing) {
      throw new Error('Property already saved');
    }

    const newSaved = {
      ...savedData,
      id: Date.now().toString(),
      savedDate: new Date().toISOString()
    };
    savedProperties.push(newSaved);
    return { ...newSaved };
  },

  async update(propertyId, savedData) {
    await delay(250);
    const index = savedProperties.findIndex(s => s.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    savedProperties[index] = { ...savedProperties[index], ...savedData };
    return { ...savedProperties[index] };
  },

  async delete(propertyId) {
    await delay(200);
    const index = savedProperties.findIndex(s => s.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    const deleted = savedProperties[index];
    savedProperties.splice(index, 1);
    return { ...deleted };
  },

  async isSaved(propertyId) {
    await delay(100);
    return savedProperties.some(s => s.propertyId === propertyId);
  },

  async addNote(propertyId, note) {
    await delay(200);
    const index = savedProperties.findIndex(s => s.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    savedProperties[index].notes = note;
    return { ...savedProperties[index] };
  }
};