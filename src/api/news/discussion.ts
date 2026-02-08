import { insightApiClient } from "./client";

// ─── 타입 정의 ───

export type DiscussionSortType = "LATEST" | "POPULAR";

/** 댓글 응답 */
export type CommentResponse = {
  id: number;
  userId: string;
  content: string;
  likeCount: number;
  createdAt: string;
  edited: boolean;
};

/** 토론 응답 */
export type DiscussionResponse = {
  id: number;
  userId: string;
  content: string;
  newsId: number;
  likeCount: number;
  comments: CommentResponse[];
  createdAt: string;
  edited: boolean;
};

// ─── API 메서드 ───

export const discussionApi = {
  /** 토론 목록 조회: GET /discussions */
  getDiscussions: async (sort: DiscussionSortType = "LATEST"): Promise<DiscussionResponse[]> => {
    const res = await insightApiClient.get<DiscussionResponse[]>("/discussions", {
      params: { sort },
    });
    return Array.isArray(res.data) ? res.data : [];
  },

  /** 토론 작성: POST /discussions */
  createDiscussion: async (newsId: number, content: string): Promise<DiscussionResponse> => {
    const res = await insightApiClient.post<DiscussionResponse>("/discussions", null, {
      params: { newsId, content },
    });
    return res.data;
  },

  /** 토론 좋아요 토글: POST /discussions/{discussionId}/like */
  toggleDiscussionLike: async (discussionId: number): Promise<void> => {
    await insightApiClient.post(`/discussions/${discussionId}/like`);
  },

  /** 토론 삭제: DELETE /discussions/{discussionId} */
  deleteDiscussion: async (discussionId: number): Promise<void> => {
    await insightApiClient.delete(`/discussions/${discussionId}`);
  },

  /** 댓글 목록 조회: GET /discussions/{discussionId}/comments */
  getComments: async (discussionId: number): Promise<CommentResponse[]> => {
    const res = await insightApiClient.get<CommentResponse[]>(`/discussions/${discussionId}/comments`);
    return Array.isArray(res.data) ? res.data : [];
  },

  /** 댓글 작성: POST /discussions/{discussionId}/comments */
  createComment: async (discussionId: number, content: string): Promise<CommentResponse> => {
    const res = await insightApiClient.post<CommentResponse>(`/discussions/${discussionId}/comments`, null, {
      params: { content },
    });
    return res.data;
  },

  /** 댓글 좋아요 토글: POST /discussions/comments/{commentId}/like */
  toggleCommentLike: async (commentId: number): Promise<void> => {
    await insightApiClient.post(`/discussions/comments/${commentId}/like`);
  },

  /** 댓글 삭제: DELETE /discussions/comments/{commentId} */
  deleteComment: async (commentId: number): Promise<void> => {
    await insightApiClient.delete(`/discussions/comments/${commentId}`);
  },
};
