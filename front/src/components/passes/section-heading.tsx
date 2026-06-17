type SectionHeadingProps = {
  description?: string;
  id: string;
  title: string;
};

export function SectionHeading({
  description,
  id,
  title,
}: SectionHeadingProps) {
  return (
    <div className="max-w-[42.5rem]">
      <h2
        className="text-balance text-[1.75rem] font-bold leading-[36.4px] text-foreground md:text-[2.25rem] md:leading-[1.25]"
        id={id}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-pretty text-base leading-6 text-muted-foreground md:text-lg md:leading-[27px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
