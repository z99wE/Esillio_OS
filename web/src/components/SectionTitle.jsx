export default function SectionTitle({
    eyebrow,
    title,
    subtitle,
    align = "left"
}) {
    return (
        <section
            className="section-title"
            style={{
                textAlign: align
            }}
        >
            {eyebrow && (
                <span className="eyebrow">
                    {eyebrow}
                </span>
            )}

            <h1 className="hero-title">
                {title}
            </h1>

            {subtitle && (
                <p className="hero-subtitle">
                    {subtitle}
                </p>
            )}
        </section>
    );
}