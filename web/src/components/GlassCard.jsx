export default function GlassCard({

    children,

    className = ""

}) {

    return (

        <div
            className={`glass glass-card ${className}`}
        >

            {children}

        </div>

    );

}