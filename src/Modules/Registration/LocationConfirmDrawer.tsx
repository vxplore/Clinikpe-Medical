import { Button, Card, Group } from "@mantine/core";
import { MapPin, Edit2 } from "lucide-react";
import { BUTTON_BLUE } from "../../Constants/colors.ts";
import { useNavigate } from "react-router-dom";
import { useRegistrationStore } from "../../stores/registrationStore";

interface LocationConfirmDrawerProps {
  location: {
    lat: number;
    lng: number;
    name?: string;
  } | null;
  onConfirm: (location: { lat: number; lng: number; name?: string }) => void;
  onEdit: () => void;
}

export default function LocationConfirmDrawer({
  location,
  onConfirm,
  onEdit,
}: LocationConfirmDrawerProps) {
  const navigate = useNavigate();
  const { setAddress } = useRegistrationStore();

  const handleConfirmAndReturn = (location: {
    lat: number;
    lng: number;
    name?: string;
  }) => {
    // Save address to Zustand
    setAddress({
      name:
        location.name ||
        `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
      lat: location.lat,
      lng: location.lng,
    });

    // Call the original onConfirm if needed
    onConfirm(location);

    // Navigate back to BasicDetails
    navigate(-1);
  };

  if (!location) return null;

  return (
    <>
      {/* Bottom Drawer - Always Visible, Non-blocking */}
      <div className="fixed rounded-t-3xl bottom-0 left-0 right-0 z-40 pointer-events-none">
        <Card className="rounded-t-3xl rounded-b-none shadow-2xl w-full m-0 pointer-events-auto">
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <Card.Section className="p-4 border-b">
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <div className="text-red-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Selected Location</h3>
                  <p className="text-sm text-gray-600 truncate">
                    {location.name ||
                      `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                  </p>
                </div>
              </Group>
              <button
                onClick={onEdit}
                className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
                title="Edit location"
              >
                <Edit2 size={20} className="text-blue-600" />
              </button>
            </Group>
          </Card.Section>

          <Card.Section className="p-4">
            <Button
              style={{ backgroundColor: BUTTON_BLUE }}
              fullWidth
              size="lg"
              onClick={() => handleConfirmAndReturn(location)}
              className="b hover:bg-blue-700"
            >
              Confirm Location & Continue
            </Button>
          </Card.Section>
        </Card>
      </div>
    </>
  );
}
