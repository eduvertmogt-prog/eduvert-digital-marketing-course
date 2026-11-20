const audiences = [
  {
    name: "Freshers",
    detail: "Learn the fundamentals, practise on live campaigns, and build a project you can discuss in your first digital marketing interview.",
  },
  {
    name: "Working professionals",
    detail: "Apply SEO, paid media, analytics, and AI tools in your current role or build practical experience for a move into marketing.",
  },
  {
    name: "Business owners",
    detail: "Plan campaigns for your business, reach the right customers, and use lead and conversion data to decide where to spend.",
  },
  {
    name: "Homemakers",
    detail: "Build skills in content, social media, and campaign measurement as you prepare to return to work or promote a home-based business.",
  },
]

export function ProgramAudience() {
  return (
    <section id="who-should-join" aria-labelledby="program-audience-heading" className="scroll-mt-6 border-y border-eduvert-border-subtle bg-eduvert-tint-soft-blue">
      <div className="mx-auto grid w-full max-w-[1440px] items-start gap-6 px-6 py-10 min-[950px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] min-[950px]:gap-10 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
        <div className="grid max-w-[390px] gap-3">
          <h2 id="program-audience-heading" className="eduvert-h2 text-eduvert-text-primary">Who should join?</h2>
          <p className="eduvert-body-large text-eduvert-text-secondary">The program starts with the essentials and gives you practical work to build on.</p>
        </div>
        <ul className="grid gap-x-6 sm:grid-cols-2">
          {audiences.map(audience => (
            <li key={audience.name} className="grid content-start gap-1.5 border-t border-eduvert-border-subtle py-4 sm:py-5">
              <h3 className="eduvert-h4 text-eduvert-text-primary">{audience.name}</h3>
              <p className="eduvert-body text-eduvert-text-secondary">{audience.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
