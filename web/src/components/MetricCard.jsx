import GlassCard from "./GlassCard";

export default function MetricCard({

    title,

    value,

    subtitle

}) {

    return (

        <GlassCard className="metric-card">

            <h4>

                {title}

            </h4>

            <h2>

                {value}

            </h2>

            <p>

                {subtitle}

            </p>

        </GlassCard>

    );

}