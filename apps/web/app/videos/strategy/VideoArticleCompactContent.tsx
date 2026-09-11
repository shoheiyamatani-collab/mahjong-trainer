export type VideoArticleCompactPoint = {
  title: string;
  description?: string;
};

type VideoArticleCompactContentProps = {
  message: string;
  points: VideoArticleCompactPoint[];
};

export function VideoArticleCompactContent({ message, points }: VideoArticleCompactContentProps) {
  return (
    <>
      <section className="videoArticleBodySection">
        <p className="videoArticleSectionLabel">MESSAGE</p>
        <h2>この動画が伝えようとしていること</h2>
        <p>{message}</p>
      </section>

      <section className="videoArticleBodySection">
        <p className="videoArticleSectionLabel">SUMMARY</p>
        <h2>動画の内容を簡潔にまとめると</h2>
        <div className="videoPrincipleList">
          {points.slice(0, 3).map((point, index) => (
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
    </>
  );
}
