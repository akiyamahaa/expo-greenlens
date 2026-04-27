import { httpClient } from "@/shared/api/http-client";
import { PRIVATE_ROUTES } from "@/shared/api/private-routes";

export interface AnalyzeWasteResponse {
  id?: string; // Total vision session ID
  article: {
    id: string;
    title: string;
    content: string;
    image: string;
    type: string;
    status: string;
  };
  vision: {
    imageUrl: string;
    model: string;
    provider: string;
    totalTokens: number;
  };
}

export async function analyzeWasteApi(imageUri: string): Promise<AnalyzeWasteResponse> {
  const formData = new FormData();
  
  // Create a file object from URI
  const filename = imageUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;

  formData.append('image', {
    uri: imageUri,
    name: filename,
    type,
  } as any);

  const { data } = await httpClient.post<AnalyzeWasteResponse>(
    PRIVATE_ROUTES.analyzeWaste,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      requiresAuth: true,
      timeout: 30000,
    }
  );

  return data;
}
