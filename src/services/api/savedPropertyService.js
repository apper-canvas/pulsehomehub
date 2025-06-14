import { toast } from 'react-toastify';

export const savedPropertyService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
                'property_id', 'saved_date', 'notes']
      };
      
      const response = await apperClient.fetchRecords('saved_property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching saved properties:", error);
      toast.error("Failed to load saved properties");
      return [];
    }
  },

  async getById(propertyId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
                'property_id', 'saved_date', 'notes'],
        where: [
          {
            FieldName: "property_id",
            Operator: "ExactMatch",
            Values: [propertyId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('saved_property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data || response.data.length === 0) {
        throw new Error('Saved property not found');
      }
      
      return response.data[0];
    } catch (error) {
      console.error(`Error fetching saved property with ID ${propertyId}:`, error);
      throw error;
    }
  },

  async create(savedData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Check if already saved
      const existing = await this.isSaved(savedData.property_id);
      if (existing) {
        throw new Error('Property already saved');
      }
      
      // Only include updateable fields
      const updateableData = {
        property_id: parseInt(savedData.property_id),
        saved_date: savedData.saved_date || new Date().toISOString(),
        notes: savedData.notes || ''
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('saved_property', params);
      
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
          toast.success('Property saved to favorites');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating saved property:", error);
      toast.error("Failed to save property");
      throw error;
    }
  },

  async update(propertyId, savedData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // First get the saved property record to find its ID
      const savedProperty = await this.getById(propertyId);
      
      // Only include updateable fields
      const updateableData = {
        Id: savedProperty.Id,
        ...Object.fromEntries(
          Object.entries(savedData).filter(([key]) => 
            ['property_id', 'saved_date', 'notes'].includes(key)
          )
        )
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('saved_property', params);
      
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
          toast.success('Saved property updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating saved property:", error);
      toast.error("Failed to update saved property");
      throw error;
    }
  },

  async delete(propertyId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // First get the saved property record to find its ID
      const savedProperty = await this.getById(propertyId);
      
      const params = {
        RecordIds: [savedProperty.Id]
      };
      
      const response = await apperClient.deleteRecord('saved_property', params);
      
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
          toast.success('Property removed from favorites');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting saved property:", error);
      toast.error("Failed to remove from favorites");
      throw error;
    }
  },

  async isSaved(propertyId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        Fields: ['Id'],
        where: [
          {
            FieldName: "property_id",
            Operator: "ExactMatch",
            Values: [propertyId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('saved_property', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      return response.data && response.data.length > 0;
    } catch (error) {
      console.error("Error checking if property is saved:", error);
      return false;
    }
  },

  async addNote(propertyId, note) {
    try {
      return await this.update(propertyId, { notes: note });
    } catch (error) {
      console.error("Error adding note to saved property:", error);
      toast.error("Failed to add note");
      throw error;
    }
  }
};