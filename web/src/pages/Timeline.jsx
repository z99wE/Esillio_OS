import { useEffect, useState } from "react";
import { getTimeline } from "../api/timeline";

export default function Timeline() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function loadTimeline() {

            try {

                const response = await getTimeline();

                if (Array.isArray(response)) {
                    setEvents(response);
                } else if (response.timeline) {
                    setEvents(response.timeline);
                } else if (response.events) {
                    setEvents(response.events);
                } else {
                    setEvents([]);
                }

            } catch (err) {

                console.error(err);

                setError("Unable to load timeline.");

            } finally {

                setLoading(false);

            }

        }

        loadTimeline();

    }, []);

    return (

<div className="page">

<section className="hero-section">

<span className="eyebrow">

LONGITUDINAL HEALTH

</span>

<h1 className="hero-title">

Your Health Timeline

</h1>

<p className="hero-subtitle">

Every uploaded document contributes to a continuous health story,
making trends and medical events easier to understand over time.

</p>

</section>

{

loading && (

<div className="glass loading-card">

Loading timeline...

</div>

)

}

{

error && (

<div className="glass error-card">

{error}

</div>

)

}

{

!loading &&

events.length===0 && (

<div className="glass empty-card">

<h2>

Nothing here yet

</h2>

<p>

Upload your first medical report to begin
building your timeline.

</p>

</div>

)

}

<div className="timeline-container">

{

events.map((event,index)=>(

<div
className="timeline-row"
key={event.id || index}
>

<div className="timeline-marker">

<div className="timeline-dot"/>

<div className="timeline-line"/>

</div>

<div className="glass timeline-card">

<div className="timeline-header">

<h3>

{event.title}

</h3>

<span>

{event.category}

</span>

</div>

{

event.date && (

<p className="timeline-date">

{event.date}

</p>

)

}

{

event.description && (

<p className="timeline-description">

{event.description}

</p>

)

}

{

event.confidence && (

<div className="confidence-pill">

Confidence

{" "}

{

Math.round(

event.confidence*100

)

}

%

</div>

)

}

</div>

</div>

))

}

</div>

</div>

);

}