// src/app/core/models/models.ts
export interface OpenAiQuery {
    id?: number;
    prompt: string;
    response: string;
    timestamp: Date;
  }
  
  export interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
  }