import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getArticlesApi } from "../api/get-articles";
import { getArticleByDetailApi } from "../api/get-article-detail";
import { getLikedArticlesApi } from "../api/get-liked-articles";
import { toggleLikeApi } from "../api/toggle-like";
import { Article, GetArticlesParams } from "../types/articles.types";

export function useArticles(params: GetArticlesParams) {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: () => getArticlesApi(params),
  });
}

export function useArticleDetail(id: string) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleByDetailApi(id),
    enabled: !!id,
  });
}

export function useLikedArticles(params: GetArticlesParams) {
  return useQuery({
    queryKey: ["articles", "liked", params],
    queryFn: () => getLikedArticlesApi(params),
  });
}

export function useToggleLike(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleLikeApi(articleId),
    onMutate: async () => {
      // Cancel in-flight queries for this article
      await queryClient.cancelQueries({ queryKey: ["article", articleId] });

      // Snapshot previous value
      const previous = queryClient.getQueryData<Article>(["article", articleId]);

      // Optimistically update
      queryClient.setQueryData<Article>(["article", articleId], (old) => {
        if (!old) return old;
        const liked = !old.isLiked;
        return {
          ...old,
          isLiked: liked,
          _count: {
            ...old._count,
            likes: old._count.likes + (liked ? 1 : -1),
          },
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(["article", articleId], context.previous);
      }
    },
    onSettled: () => {
      // Refresh detail and all list caches globally
      queryClient.invalidateQueries({ queryKey: ["article"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
