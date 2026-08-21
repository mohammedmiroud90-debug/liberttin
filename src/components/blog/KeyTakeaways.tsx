/** Cream summary card that opens the article, closed by the brand wordmark. */
export function KeyTakeaways({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <section
      aria-label="Key takeaways"
      className="mb-9 rounded-lg bg-[#FDF3E7] px-6 py-7 md:px-8 md:py-8"
    >
      <h2 className="mb-5 text-[1.3rem] font-bold leading-none text-[#1a1a1a] md:text-[1.45rem]">
        Key takeaways
      </h2>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3.5">
            <span
              className="mt-[9px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-[#c2185b]"
              aria-hidden="true"
            />
            <span className="text-[15px] leading-[1.6] text-[#3d3833]">{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-7 text-right text-[13px] font-bold tracking-tight text-[#1a1a1a]">
        BILLIANT
      </p>
    </section>
  );
}
