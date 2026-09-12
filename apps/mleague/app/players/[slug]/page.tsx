import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayerProfile } from "@/components/mleague/PlayerProfile";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { players } from "@/data/mleague/players";
import { teams } from "@/data/mleague/teams";
import { getPlayerBySlug } from "@/lib/mleague/getPlayerBySlug";
import { getCurrentMembership } from "@/lib/mleague/getPlayers";
import { getTeamThemeStyle } from "@/lib/mleague/teamThemes";

type PlayerPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return players
    .filter((player) => player.publicationStatus === "published")
    .map((player) => ({ slug: player.slug }));
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getPlayerBySlug(slug);
  if (!result) return { title: "選手が見つかりません" };

  if (result.player.slug === "oi-takaharu") {
    return {
      title: { absolute: "多井隆晴｜RMU・渋谷ABEMAS所属" },
      description:
        "RMUおよび渋谷ABEMASに所属するプロ雀士、多井隆晴のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "shiratori-sho") {
    return {
      title: { absolute: "白鳥翔｜日本プロ麻雀連盟・渋谷ABEMAS所属" },
      description:
        "日本プロ麻雀連盟および渋谷ABEMASに所属するプロ雀士、白鳥翔のプロフィール、公式YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "matsumoto-yoshihiro") {
    return {
      title: { absolute: "松本吉弘｜日本プロ麻雀協会・渋谷ABEMAS所属" },
      description:
        "日本プロ麻雀協会および渋谷ABEMASに所属するプロ雀士、松本吉弘のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "hinata-aiko") {
    return {
      title: { absolute: "日向藍子｜最高位戦日本プロ麻雀協会・渋谷ABEMAS所属" },
      description:
        "最高位戦日本プロ麻雀協会および渋谷ABEMASに所属するプロ雀士、日向藍子のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "sonoda-ken") {
    return {
      title: { absolute: "園田賢｜最高位戦日本プロ麻雀協会・赤坂ドリブンズ所属" },
      description:
        "最高位戦日本プロ麻雀協会および赤坂ドリブンズに所属するプロ雀士、園田賢のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "suzuki-taro") {
    return {
      title: { absolute: "鈴木たろう｜最高位戦日本プロ麻雀協会・赤坂ドリブンズ所属" },
      description:
        "最高位戦日本プロ麻雀協会および赤坂ドリブンズに所属するプロ雀士、鈴木たろうのプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "asami-maki") {
    return {
      title: { absolute: "浅見真紀｜最高位戦日本プロ麻雀協会・赤坂ドリブンズ所属" },
      description:
        "最高位戦日本プロ麻雀協会および赤坂ドリブンズに所属するプロ雀士、浅見真紀のプロフィール、公式X、確認済みの出典を紹介します。",
    };
  }

  if (result.player.slug === "watanabe-futoshi") {
    return {
      title: { absolute: "渡辺太｜最高位戦日本プロ麻雀協会・赤坂ドリブンズ所属" },
      description:
        "最高位戦日本プロ麻雀協会および赤坂ドリブンズに所属するプロ雀士、渡辺太のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "nikaido-aki") {
    return {
      title: { absolute: "二階堂亜樹｜日本プロ麻雀連盟・EX風林火山所属" },
      description:
        "日本プロ麻雀連盟およびEX風林火山に所属するプロ雀士、二階堂亜樹のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "nagai-kosuke") {
    return {
      title: { absolute: "永井孝典｜最高位戦日本プロ麻雀協会・EX風林火山所属" },
      description:
        "最高位戦日本プロ麻雀協会およびEX風林火山に所属するプロ雀士、永井孝典のプロフィール、公式X、確認済みの出典を紹介します。",
    };
  }

  if (result.player.slug === "katsumata-kenji") {
    return {
      title: { absolute: "勝又健志｜日本プロ麻雀連盟・EX風林火山所属" },
      description:
        "日本プロ麻雀連盟およびEX風林火山に所属するプロ雀士、勝又健志のプロフィール、公式X、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "uchikawa-kotaro") {
    return {
      title: { absolute: "内川幸太郎｜日本プロ麻雀連盟・EX風林火山所属" },
      description:
        "日本プロ麻雀連盟およびEX風林火山に所属するプロ雀士、内川幸太郎のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "date-arisa") {
    return {
      title: { absolute: "伊達朱里紗｜日本プロ麻雀連盟・KONAMI麻雀格闘倶楽部所属" },
      description:
        "日本プロ麻雀連盟およびKONAMI麻雀格闘倶楽部に所属するプロ雀士、伊達朱里紗のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "takamiya-mari") {
    return {
      title: { absolute: "高宮まり｜日本プロ麻雀連盟・KONAMI麻雀格闘倶楽部所属" },
      description:
        "日本プロ麻雀連盟およびKONAMI麻雀格闘倶楽部に所属するプロ雀士、高宮まりのプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "sasaki-hisato") {
    return {
      title: { absolute: "佐々木寿人｜日本プロ麻雀連盟・KONAMI麻雀格闘倶楽部所属" },
      description:
        "日本プロ麻雀連盟およびKONAMI麻雀格闘倶楽部に所属するプロ雀士、佐々木寿人のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "kayamori-sayaka") {
    return {
      title: { absolute: "茅森早香｜最高位戦日本プロ麻雀協会・セガサミーフェニックス所属" },
      description:
        "最高位戦日本プロ麻雀協会およびセガサミーフェニックスに所属するプロ雀士、茅森早香のプロフィール、公式X、YouTube、確認済みの出典を紹介します。",
    };
  }

  if (result.player.slug === "takeuchi-genta") {
    return {
      title: { absolute: "竹内元太｜最高位戦日本プロ麻雀協会・セガサミーフェニックス所属" },
      description:
        "最高位戦日本プロ麻雀協会およびセガサミーフェニックスに所属するプロ雀士、竹内元太のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "daigo-hiroshi") {
    return {
      title: { absolute: "醍醐大｜最高位戦日本プロ麻雀協会・セガサミーフェニックス所属" },
      description:
        "最高位戦日本プロ麻雀協会およびセガサミーフェニックスに所属するプロ雀士、醍醐大のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "sano-hinako") {
    return {
      title: { absolute: "佐野ひなこ｜最高位戦日本プロ麻雀協会・セガサミーフェニックス所属" },
      description:
        "最高位戦日本プロ麻雀協会およびセガサミーフェニックスに所属するプロ雀士、佐野ひなこのプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "akutsu-shota") {
    return {
      title: { absolute: "阿久津翔太｜日本プロ麻雀連盟・KADOKAWAサクラナイツ所属" },
      description:
        "日本プロ麻雀連盟およびKADOKAWAサクラナイツに所属するプロ雀士、阿久津翔太のプロフィール、公式X、YouTube、確認済みの出典を紹介します。",
    };
  }

  if (result.player.slug === "shirinashihama-wataru") {
    return {
      title: { absolute: "尻無濱航｜日本プロ麻雀協会・KADOKAWAサクラナイツ所属" },
      description:
        "日本プロ麻雀協会およびKADOKAWAサクラナイツに所属するプロ雀士、尻無濱航のプロフィール、公式X、確認済みの出典を紹介します。",
    };
  }

  if (result.player.slug === "hori-shingo") {
    return {
      title: { absolute: "堀慎吾｜日本プロ麻雀連盟・KADOKAWAサクラナイツ所属" },
      description:
        "日本プロ麻雀連盟およびKADOKAWAサクラナイツに所属するプロ雀士、堀慎吾のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "okada-sayaka") {
    return {
      title: { absolute: "岡田紗佳｜日本プロ麻雀連盟・KADOKAWAサクラナイツ所属" },
      description:
        "日本プロ麻雀連盟およびKADOKAWAサクラナイツに所属するプロ雀士、岡田紗佳のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "setokuma-naoki") {
    return {
      title: { absolute: "瀬戸熊直樹｜日本プロ麻雀連盟・TEAM RAIDEN / 雷電所属" },
      description:
        "日本プロ麻雀連盟およびTEAM RAIDEN / 雷電に所属するプロ雀士、瀬戸熊直樹のプロフィール、公式X、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "hagiwara-masato") {
    return {
      title: { absolute: "萩原聖人｜日本プロ麻雀連盟・TEAM RAIDEN / 雷電所属" },
      description:
        "日本プロ麻雀連盟およびTEAM RAIDEN / 雷電に所属するプロ雀士、萩原聖人のプロフィール、公式YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "kurosawa-saki") {
    return {
      title: { absolute: "黒沢咲｜日本プロ麻雀連盟・TEAM RAIDEN / 雷電所属" },
      description:
        "日本プロ麻雀連盟およびTEAM RAIDEN / 雷電に所属するプロ雀士、黒沢咲のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "honda-tomohiro") {
    return {
      title: { absolute: "本田朋広｜日本プロ麻雀連盟・TEAM RAIDEN / 雷電所属" },
      description:
        "日本プロ麻雀連盟およびTEAM RAIDEN / 雷電に所属するプロ雀士、本田朋広のプロフィール、公式X、確認済みの出典を紹介します。",
    };
  }

  if (result.player.slug === "mizuhara-akina") {
    return {
      title: { absolute: "瑞原明奈｜最高位戦日本プロ麻雀協会・U-NEXT Pirates所属" },
      description:
        "最高位戦日本プロ麻雀協会およびU-NEXT Piratesに所属するプロ雀士、瑞原明奈のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "suzuki-yu") {
    return {
      title: { absolute: "鈴木優｜最高位戦日本プロ麻雀協会・U-NEXT Pirates所属" },
      description:
        "最高位戦日本プロ麻雀協会およびU-NEXT Piratesに所属するプロ雀士、鈴木優のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "nakabayashi-kei") {
    return {
      title: { absolute: "仲林圭｜日本プロ麻雀協会・U-NEXT Pirates所属" },
      description:
        "日本プロ麻雀協会およびU-NEXT Piratesに所属するプロ雀士、仲林圭のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "asakura-koshin") {
    return {
      title: { absolute: "朝倉康心｜最高位戦日本プロ麻雀協会・U-NEXT Pirates所属" },
      description:
        "最高位戦日本プロ麻雀協会およびU-NEXT Piratesに所属するプロ雀士、朝倉康心のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "nakada-kana") {
    return {
      title: { absolute: "中田花奈｜日本プロ麻雀連盟・BEAST X所属" },
      description:
        "日本プロ麻雀連盟およびBEAST Xに所属するプロ雀士、中田花奈のプロフィール、公式X、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "shimoishi-geki") {
    return {
      title: { absolute: "下石戟｜日本プロ麻雀協会・BEAST X所属" },
      description:
        "日本プロ麻雀協会およびBEAST Xに所属するプロ雀士、下石戟のプロフィール、公式X、YouTube、確認済みの出典を紹介します。",
    };
  }

  if (result.player.slug === "tojo-rio") {
    return {
      title: { absolute: "東城りお｜日本プロ麻雀連盟・BEAST X所属" },
      description:
        "日本プロ麻雀連盟およびBEAST Xに所属するプロ雀士、東城りおのプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "ishii-kazuma") {
    return {
      title: { absolute: "石井一馬｜最高位戦日本プロ麻雀協会・EARTH JETS所属" },
      description:
        "最高位戦日本プロ麻雀協会およびEARTH JETSに所属するプロ雀士、石井一馬のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "miura-tomohiro") {
    return {
      title: { absolute: "三浦智博｜日本プロ麻雀連盟・EARTH JETS所属" },
      description:
        "日本プロ麻雀連盟およびEARTH JETSに所属するプロ雀士、三浦智博のプロフィール、公式X、確認済みの出典を紹介します。",
    };
  }

  if (result.player.slug === "aikawa-megumu") {
    return {
      title: { absolute: "逢川恵夢｜日本プロ麻雀協会・EARTH JETS所属" },
      description:
        "日本プロ麻雀協会およびEARTH JETSに所属するプロ雀士、逢川恵夢のプロフィール、公式X、YouTube、確認済みの出典を紹介します。",
    };
  }

  if (result.player.slug === "hiro-shibata") {
    return {
      title: { absolute: "HIRO柴田｜日本プロ麻雀連盟・EARTH JETS所属" },
      description:
        "日本プロ麻雀連盟およびEARTH JETSに所属するプロ雀士、HIRO柴田のプロフィール、公式X、YouTube、確認済みの出典を紹介します。",
    };
  }

  if (result.player.slug === "suzuki-daisuke") {
    return {
      title: { absolute: "鈴木大介｜日本プロ麻雀連盟・BEAST X所属" },
      description:
        "日本プロ麻雀連盟およびBEAST Xに所属するプロ雀士・将棋棋士、鈴木大介のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  if (result.player.slug === "takizawa-kazunori") {
    return {
      title: { absolute: "滝沢和典｜日本プロ麻雀連盟・KONAMI麻雀格闘倶楽部所属" },
      description:
        "日本プロ麻雀連盟およびKONAMI麻雀格闘倶楽部に所属するプロ雀士、滝沢和典のプロフィール、公式X、YouTube、出版書籍を紹介します。",
    };
  }

  const currentMembership = getCurrentMembership(result.player.id);
  const teamName = currentMembership
    ? teams.find((team) => team.id === currentMembership.teamId)?.name
    : undefined;

  return {
    title: `${result.player.name}｜Mリーグ選手名鑑`,
    description: `${result.player.name}（${result.player.nameKana}）選手の${teamName || "チーム"}所属情報、${result.player.proAssociation || "所属団体"}、Mリーグ加入シーズン、出典を掲載しています。`,
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;
  const result = getPlayerBySlug(slug);
  if (!result) notFound();
  const currentMembership = getCurrentMembership(result.player.id);

  return (
    <main
      id="main-content"
      className="page-shell player-profile-page"
      style={getTeamThemeStyle(currentMembership?.teamId)}
    >
      <PlayerProfile {...result} />
      <UnofficialNotice />
    </main>
  );
}
