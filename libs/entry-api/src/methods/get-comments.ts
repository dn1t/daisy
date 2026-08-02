import { fetch, type Result } from "..";

export interface Comment {
  id: string;
  user: { id: string };
  content: string;
}

export async function getComments(id: string): Promise<Result<Comment[]>> {
  const res = await fetch("https://playentry.org/graphql/SELECT_COMMENTS", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query:
        "query($pageParam:PageParam$target:String){commentList(pageParam:$pageParam target:$target){list{id user{id}content}}}",
      variables: { target: id, pageParam: { display: 20, sort: "created", order: 1 } },
    }),
  });
  if (!res.ok) return { success: false, error: "댓글을 불러오는 중 오류가 발생했어요." };

  const data: {
    data: { commentList: { total: number; list: { id: string; user: { id: string }; content: string }[] } };
  } = await res.json();
  if (!data.data?.commentList) return { success: false, error: "댓글을 찾을 수 없어요." };

  return { success: true, data: data.data.commentList.list };
}
