import {useRef} from 'react';
import maplibregl from "maplibre-gl";
import Map, { MapRef, Marker, Popup, AttributionControl } from "react-map-gl/maplibre";
import { Box } from "@mui/material";


const NZ_BOUNDS = [[166, -48], [179.7, -34]];
const POSITRON_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export default function TaskMap({variant = "page"}){

    const mapRef = useRef(null);
    const containerRef = useRef(null);

    return (
        <Box
            ref={containerRef}
            sx={{
                position: "relative",
                width: "100%",
                height:
                    variant === "embed"
                        ? "100%"
                        : { xs: "calc(100dvh - 56px)", md: "calc(100dvh - 112px)" },
                minHeight: variant === "embed" ? 240 : 320,
                "&, & *": { minHeight: 0 },
                "& canvas.maplibregl-canvas, & canvas.mapboxgl-canvas": {
                    maxWidth: "none !important",
                    maxHeight: "none !important",
                },
            }}
        >
            <Map
                ref={mapRef}
                mapLib={maplibregl}
                initialViewState={{ longitude: 174.77, latitude: -41.29, zoom: 5.5 }}
                minZoom={5}
                maxZoom={16}
                dragRotate={false}
                pitchWithRotate={false}
                maxBounds={NZ_BOUNDS}
                style={{ width: "100%", height: "100%" }}
                mapStyle={POSITRON_STYLE}
                renderWorldCopies={false}
                onLoad={() => {
                    const m = mapRef.current?.getMap?.();
                    const canvas = m?.getCanvas?.();
                    if (canvas) {
                        // overrides any global rule for this canvas only
                        canvas.style.maxWidth = "none";
                        canvas.style.maxHeight = "none";
                    }
                    mapRef.current?.resize();
                }}
            >

            </Map>
        </Box>
    )
}