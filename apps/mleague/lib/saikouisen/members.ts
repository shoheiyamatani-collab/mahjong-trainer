import source from "@/data/saikouisen/members.json";
import type {
  SaikouisenMember,
  SaikouisenMemberGroup,
} from "@/types/saikouisen";

type SourceMember = Omit<SaikouisenMember, "slug">;

function getSlug(sourceUrl: string) {
  return new URL(sourceUrl).pathname.split("/").filter(Boolean).at(-1) || "";
}

export const saikouisenMembers: SaikouisenMember[] = (
  source.members as SourceMember[]
).map((member) => ({
  ...member,
  slug: getSlug(member.sourceUrl),
}));

const memberBySlug = new Map(
  saikouisenMembers.map((member) => [member.slug, member]),
);

export function getSaikouisenMemberBySlug(slug: string) {
  return memberBySlug.get(slug);
}

export function getSaikouisenMemberGroups(): SaikouisenMemberGroup[] {
  const groups = new Map<string, SaikouisenMember[]>();

  for (const member of saikouisenMembers) {
    const joiningClass = member.joiningClass || "入会期未記載";
    const group = groups.get(joiningClass) || [];
    group.push(member);
    groups.set(joiningClass, group);
  }

  return Array.from(groups, ([joiningClass, members]) => ({
    joiningClass,
    members,
  }));
}

export function getMemberTitles(member: SaikouisenMember) {
  return member.titles
    .split(" ／ ")
    .map((title) => title.trim())
    .filter(Boolean);
}
