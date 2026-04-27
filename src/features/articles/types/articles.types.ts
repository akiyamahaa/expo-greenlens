export interface Article {
  id: string;
  title: string;
  image: string;
  description?: string | null;
  content: string;
  status: string;
  type: "post" | "library";
  categoryId: string | null;
  isLiked: boolean;
  _count: {
    likes: number;
  };
  category?: {
    id: string;
    title: string;
  } | null;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleDetail extends Article {}

export interface GetArticlesParams {
  status?: string;
  type?: "post" | "library";
  categoryId?: string;
  keyword?: string;
  page?: number;
  perPage?: number;
}

export interface GetArticlesResponse {
  data: Article[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
