import { useState, useEffect } from "react";
import MapModal from "./MapModal";
import FormModal from "./FormModal";



export default function ReportModal({ open, onClose, onSubmit, actionType, tipoReporte }) {

    const [step, setStep] = useState("map"); // "map" | "form"
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        if (!open) {
            setStep("map");
            setCoords(null);
        }
    }, [open]);

    if (!open) return null;
    return (
        <>
            {step === "map" && (
                <MapModal
                    open={true}
                    onClose={onClose}
                    onContinue={(selectedCoords) => {
                        setCoords(selectedCoords);
                        setStep("form");
                    }}
                />
            )}

            {step === "form" && (
                <FormModal
                    open={true}
                    coords={coords}
                    actionType={actionType}
                    tipoReporte={tipoReporte}
                    onBack={() => setStep("map")}
                    onClose={onClose}
                    onSubmit={async (data) => {
                        await onSubmit(data);
                    }}
                />
            )}
        </>
    );
}
