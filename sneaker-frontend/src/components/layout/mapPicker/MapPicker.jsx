import React, { useEffect } from 'react';
import './MapPicker.css'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Cấu hình icon tùy chỉnh
const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
});
L.Marker.prototype.options.icon = customIcon;

// Cập nhật tâm bản đồ khi tọa độ thay đổi
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15, { animate: true });
        }
    }, [center, map]);
    return null;
}

// Lấy tọa độ khi click trên bản đồ
function LocationMarker({ position, setPosition, setFormData, setShowSuggestions }) {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi&email=22130307@st.hcmuaf.edu.vn`);
                const data = await response.json();

                if (data && data.display_name) {
                    setShowSuggestions(false);  // Ẩn gợi ý để không tự động tìm kiếm lại
                    setFormData(prev => ({
                        ...prev,
                        shippingAddress: data.display_name
                    }));
                }
            } catch (error) {
                console.error("Không thể lấy địa chỉ tự động:", error);
            }
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={customIcon}></Marker>
    );
}

const MapPicker = ({ mapPosition, setMapPosition, setFormData, setShowSuggestions }) => {
    return (
        <div className="map-container-wrapper">
            <MapContainer center={mapPosition} zoom={15} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <LocationMarker
                    position={mapPosition}
                    setPosition={setMapPosition}
                    setFormData={setFormData}
                    setShowSuggestions={setShowSuggestions}
                />
                <MapUpdater center={mapPosition} />
            </MapContainer>
        </div>
    );
};

export default MapPicker;