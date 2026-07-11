import useUpload from "../hooks/useUpload";

export default function HealthIntelligence() {

    const upload = useUpload();

    if (!upload) {

        return (

            <div className="page">

                <section className="hero-section">

                    <h1 className="hero-title">
                        Health Intelligence
                    </h1>

                    <p className="hero-subtitle">
                        Upload your first medical document
                        to build your longitudinal health
                        intelligence.
                    </p>

                </section>

            </div>

        );

    }

    const timeline = upload.timeline || {};

    const intelligence =
        upload.clinical_intelligence || {};

    return (

<div className="page">

<section className="hero-section">

<h1 className="hero-title">

Health Intelligence

</h1>

<p className="hero-subtitle">

Your health story is beginning to take shape.

</p>

</section>

<div className="dashboard-grid">

<div className="glass dashboard-card">

<h3>

Document

</h3>

<h2>

{upload.document?.filename || "Medical Record"}

</h2>

<p>

Successfully processed

</p>

</div>

<div className="glass dashboard-card">

<h3>

Timeline

</h3>

<h2>

{timeline.events_created ?? 0}

</h2>

<p>

Clinical events extracted

</p>

</div>

<div className="glass dashboard-card">

<h3>

Pipeline

</h3>

<h2>

{upload.status}

</h2>

<p>

AI processing completed

</p>

</div>

<div className="glass dashboard-card">

<h3>

Guardian

</h3>

<p>

{

intelligence.guardian
?

"Clinical review completed"

:

"Waiting"

}

</p>

</div>

<div className="glass dashboard-card">

<h3>

Clinical Memory

</h3>

<p>

{

intelligence.clinical_memory
?

"Updated"

:

"Pending"

}

</p>

</div>

<div className="glass dashboard-card">

<h3>

EsiWell

</h3>

<p>

Knowledge layer active

</p>

</div>

</div>

{

timeline.events && (

<div className="glass timeline-preview">

<h2>

Recent Timeline

</h2>

{

timeline.events.map((event,index)=>(

<div
className="timeline-item"
key={index}
>

<div>

<strong>

{event.title}

</strong>

</div>

<div>

{event.category}

</div>

<div>

Confidence

{" "}

{

Math.round(

event.confidence*100

)

}

%

</div>

</div>

))

}

</div>

)

}

</div>

);

}