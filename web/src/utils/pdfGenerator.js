import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generates a PDF packet based on patient data (timeline & medications)
 * @param {Object} memory - The user's memory object (from HealthContext)
 * @param {Array} timeline - The user's timeline events (from HealthContext)
 */
export async function generateDoctorPacket(memory, timeline) {
    if (!memory) return;

    // Create a temporary hidden div to render the packet content
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "800px";
    container.style.backgroundColor = "#ffffff";
    container.style.color = "#000000";
    container.style.padding = "40px";
    container.style.fontFamily = "sans-serif";
    container.id = "pdf-packet-container";

    // Build HTML content
    let html = `
        <div style="border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="font-size: 28px; margin: 0 0 10px 0;">Esillio Patient Packet</h1>
            <h2 style="font-size: 22px; margin: 0; color: #333;">${memory.name || "Patient Profile"}</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                Generated on: ${new Date().toLocaleDateString()}
            </p>
        </div>

        <div style="margin-bottom: 30px;">
            <h3 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Demographics</h3>
            <p style="margin: 5px 0;"><strong>DOB:</strong> ${memory.demographics?.dob || "N/A"}</p>
            <p style="margin: 5px 0;"><strong>Blood Type:</strong> ${memory.demographics?.bloodType || "N/A"}</p>
            <p style="margin: 5px 0;"><strong>Sex:</strong> ${memory.demographics?.sex || "N/A"}</p>
        </div>

        <div style="margin-bottom: 30px;">
            <h3 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Active Medications</h3>
            <ul style="margin-top: 10px;">
                ${memory.medications && memory.medications.length > 0 
                    ? memory.medications.map(m => `<li style="margin-bottom: 5px;"><strong>${m.name}</strong> (${m.dosage})</li>`).join('') 
                    : '<li>None recorded</li>'}
            </ul>
        </div>

        <div style="margin-bottom: 30px;">
            <h3 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Known Allergies</h3>
            <ul style="margin-top: 10px;">
                ${memory.allergies && memory.allergies.length > 0 
                    ? memory.allergies.map(a => `<li style="margin-bottom: 5px;">${a}</li>`).join('') 
                    : '<li>None recorded</li>'}
            </ul>
        </div>

        <div>
            <h3 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Health Timeline</h3>
    `;

    if (timeline && timeline.length > 0) {
        // Sort timeline descending
        const sortedTimeline = [...timeline].sort((a, b) => new Date(b.date) - new Date(a.date));
        sortedTimeline.forEach(event => {
            html += `
                <div style="margin-bottom: 15px;">
                    <p style="margin: 0; font-weight: bold; font-size: 14px;">${new Date(event.date).toLocaleDateString()} - ${event.title}</p>
                    <p style="margin: 3px 0 0 0; font-size: 13px; color: #444;">${event.description}</p>
                </div>
            `;
        });
    } else {
        html += `<p>No timeline events recorded.</p>`;
    }

    html += `</div>`;
    container.innerHTML = html;
    document.body.appendChild(container);

    try {
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        
        // Save PDF
        const filename = `Esillio_Packet_${memory.name?.replace(/\s+/g, '_') || 'Patient'}.pdf`;
        pdf.save(filename);
    } catch (error) {
        console.error("Failed to generate PDF packet:", error);
    } finally {
        // Cleanup
        document.body.removeChild(container);
    }
}
