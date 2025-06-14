import { toast } from 'react-toastify';

export const propertyService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'title', 'price', 'address', 'city', 'state', 'zip_code', 'property_type', 
                'bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'year_built', 'description', 
                'features', 'amenities', 'images', 'latitude', 'longitude', 'listing_date', 'status']
      };
      
      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'title', 'price', 'address', 'city', 'state', 'zip_code', 'property_type', 
                'bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'year_built', 'description', 
                'features', 'amenities', 'images', 'latitude', 'longitude', 'listing_date', 'status']
      };
      
      const response = await apperClient.getRecordById('property', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw error;
    }
  },

  async create(propertyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
      const updateableData = {
        title: propertyData.title,
        price: propertyData.price,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        zip_code: propertyData.zip_code,
        property_type: propertyData.property_type,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        square_feet: propertyData.square_feet,
        lot_size: propertyData.lot_size,
        year_built: propertyData.year_built,
        description: propertyData.description,
        features: propertyData.features,
        amenities: propertyData.amenities,
        images: propertyData.images,
        latitude: propertyData.latitude,
        longitude: propertyData.longitude,
        listing_date: propertyData.listing_date || new Date().toISOString(),
        status: propertyData.status || 'available'
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Property created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Failed to create property");
      throw error;
    }
  },

  async update(id, propertyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
      const updateableData = {
        Id: id,
        ...Object.fromEntries(
          Object.entries(propertyData).filter(([key]) => 
            ['title', 'price', 'address', 'city', 'state', 'zip_code', 'property_type', 
             'bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'year_built', 'description', 
             'features', 'amenities', 'images', 'latitude', 'longitude', 'listing_date', 'status'].includes(key)
          )
        )
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Property updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Property deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
      throw error;
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const searchTerm = query.toLowerCase();
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'title', 'price', 'address', 'city', 'state', 'zip_code', 'property_type', 
                'bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'year_built', 'description', 
                'features', 'amenities', 'images', 'latitude', 'longitude', 'listing_date', 'status'],
        where: [
          {
            FieldName: "title",
            Operator: "Contains",
            Values: [searchTerm]
          }
        ],
        whereGroups: [
          {
            operator: "OR",
            SubGroups: [
              {
                conditions: [
                  {
                    FieldName: "address",
                    Operator: "Contains",
                    Values: [searchTerm]
                  }
                ]
              },
              {
                conditions: [
                  {
                    FieldName: "city",
                    Operator: "Contains",
                    Values: [searchTerm]
                  }
                ]
              },
              {
                conditions: [
                  {
                    FieldName: "zip_code",
                    Operator: "Contains",
                    Values: [searchTerm]
                  }
                ]
              }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching properties:", error);
      toast.error("Failed to search properties");
      return [];
    }
  },

  async filter(filters) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const whereConditions = [];
      
      if (filters.priceMin) {
        whereConditions.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin]
        });
      }
      
      if (filters.priceMax) {
        whereConditions.push({
          FieldName: "price",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax]
        });
      }
      
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        whereConditions.push({
          FieldName: "property_type",
          Operator: "Contains",
          Values: filters.propertyTypes
        });
      }
      
      if (filters.bedroomsMin) {
        whereConditions.push({
          FieldName: "bedrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedroomsMin]
        });
      }
      
      if (filters.bathroomsMin) {
        whereConditions.push({
          FieldName: "bathrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bathroomsMin]
        });
      }
      
      if (filters.squareFeetMin) {
        whereConditions.push({
          FieldName: "square_feet",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.squareFeetMin]
        });
      }
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'title', 'price', 'address', 'city', 'state', 'zip_code', 'property_type', 
                'bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'year_built', 'description', 
                'features', 'amenities', 'images', 'latitude', 'longitude', 'listing_date', 'status'],
        where: whereConditions
      };
      
      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error filtering properties:", error);
      toast.error("Failed to filter properties");
      return [];
    }
  }
};