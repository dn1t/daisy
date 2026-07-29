import { fetch, type Result } from "..";

export interface UserProfile {
  id: string;
  nickname: string;
  profileImage: {
    filename: string;
    imageType: string;
  } | null;
}

export async function getUserProfile(id: string): Promise<Result<UserProfile>> {
  const res = await fetch("https://playentry.org/graphql/FIND_USERSTATUS_BY_USERNAME", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: "query($id:String){userstatus(id:$id){id nickname profileImage{filename imageType}}}",
      variables: { id },
    }),
  });
  if (!res.ok) return { success: false, error: "Failed to fetch user profile" };

  const data: { data: { userstatus: UserProfile } } = await res.json();
  if (!data.data?.userstatus) return { success: false, error: "User profile not found" };

  return { success: true, data: data.data.userstatus };
}
