// lib/api.ts
type FetchConcertsParams = {
    sort?: string;
    limit?: number;
    page?: number;
    tags?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }
  
  export async function getConcerts(params?: FetchConcertsParams) {
    try {
      const queryParams = new URLSearchParams({
        depth: '2',
        sort: params?.sort || 'startDate',
        page: params?.page?.toString() || '1',
        limit: params?.limit?.toString() || '12',
        ...(params?.tags && { 'where[tags][in]': params.tags }),
        ...(params?.search && { 'where[title][contains]': params.search }),
        ...(params?.startDate && { 'where[startDate][greater_than]': params.startDate }),
        ...(params?.endDate && { 'where[startDate][less_than]': params.endDate }),
      });
  
      const response = await fetch(`http://localhost:3000/api/concerts?${queryParams}`, {
        next: { revalidate: 3600 }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch concerts');
      }
  
      const data = await response.json();
      return {
        docs: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page
      };
    } catch (error) {
      console.error('Error fetching concerts:', error);
      return {
        docs: [],
        totalPages: 0,
        currentPage: 1
      };
    }
  }

  export async function getTags() {
    try {
      const response = await fetch('http://localhost:3000/api/tags?limit=100', {
        next: { revalidate: 3600 }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
  
      const data = await response.json();
      return data.docs;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }