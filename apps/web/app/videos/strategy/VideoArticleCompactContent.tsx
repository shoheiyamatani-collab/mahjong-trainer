export type VideoArticleCompactPoint = {
  title: string;
  description?: string;
};

type VideoArticleCompactContentProps = {
  message: string;
  points: VideoArticleCompactPoint[];
  editorialPerspective?: boolean;
};

export function getCompactPoints(points: VideoArticleCompactPoint[]) {
  return points.filter((point) => point.description?.trim()).slice(0, 3);
}

export function VideoArticleCompactContent({ message, points, editorialPerspective = false }: VideoArticleCompactContentProps) {
  const visiblePoints = getCompactPoints(points);
  return (
    <>
      <section className="videoArticleBodySection">
        <p className="videoArticleSectionLabel">MESSAGE</p>
        <h2>{editorialPerspective ? "この実戦解説で考えたい学習テーマ" : "この動画が伝えようとしていること"}</h2>
        <p>{message}</p>
      </section>

      {visiblePoints.length > 0 ? (
        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">SUMMARY</p>
          <h2>動画の内容を簡潔にまとめると</h2>
          <div className="videoPrincipleList">
            {visiblePoints.map((point, index) => (
              <section className="videoPrinciple" key={point.title}>
                <div className="videoPrincipleNumber">{index + 1}</div>
                <div className="videoPrincipleBody">
                  <h3>{point.title}</h3>
                  {point.description ? <p>{point.description}</p> : null}
                </div>
              </section>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
