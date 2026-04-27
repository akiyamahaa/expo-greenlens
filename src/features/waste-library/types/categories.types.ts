type CategoryType = "post" | "library";

export interface Category {
  id: string;
  title: string;
  type: CategoryType;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCategoriesParams {
  status?: string;
  keyword?: string;
  page?: number;
  perPage?: number;
}

export interface GetCategoriesResponse {
  data: Category[];
  total: number;
}
