import { delay } from '../index';

// Import mock data
import propertiesData from '../mockData/properties.json';

let properties = [...propertiesData];

export const propertyService = {
  async getAll() {
    await delay(300);
    return [...properties];
  },

  async getById(id) {
    await delay(200);
    const property = properties.find(p => p.id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  },

  async create(propertyData) {
    await delay(400);
    const newProperty = {
      ...propertyData,
      id: Date.now().toString(),
      listingDate: new Date().toISOString(),
      status: 'available'
    };
    properties.push(newProperty);
    return { ...newProperty };
  },

  async update(id, propertyData) {
    await delay(350);
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    properties[index] = { ...properties[index], ...propertyData };
    return { ...properties[index] };
  },

  async delete(id) {
    await delay(250);
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    const deletedProperty = properties[index];
    properties.splice(index, 1);
    return { ...deletedProperty };
  },

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    const results = properties.filter(property =>
      property.title.toLowerCase().includes(searchTerm) ||
      property.address.toLowerCase().includes(searchTerm) ||
      property.city.toLowerCase().includes(searchTerm) ||
      property.zipCode.includes(searchTerm) ||
      property.description.toLowerCase().includes(searchTerm)
    );
    return [...results];
  },

  async filter(filters) {
    await delay(350);
    let filtered = [...properties];

    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= filters.priceMax);
    }
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.propertyType));
    }
    if (filters.bedroomsMin) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedroomsMin);
    }
    if (filters.bathroomsMin) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathroomsMin);
    }
    if (filters.squareFeetMin) {
      filtered = filtered.filter(p => p.squareFeet >= filters.squareFeetMin);
    }

    return [...filtered];
  }
};