export type SaikouisenMember = {
  slug: string;
  name: string;
  organization: "最高位戦日本プロ麻雀協会";
  league: string;
  joiningClass: string;
  birthday: string;
  birthplace: string;
  titles: string;
  xHandle: string;
  xUrl: string;
  sourceUrl: string;
  status: string;
};

export type SaikouisenMemberGroup = {
  joiningClass: string;
  members: SaikouisenMember[];
};
