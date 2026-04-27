import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../api/get-categories";
import { getCategoryDetailApi } from "../api/get-category-detail";
import { GetCategoriesParams } from "../types/categories.types";

export function useCategories(params: GetCategoriesParams) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategoriesApi(params),
  });
}

export function useCategoryDetail(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryDetailApi(id),
    enabled: !!id,
  });
}
