import { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import logo from "../../assets/Logo.svg";
import { colors } from "../../Constants/colors";
import { useNavigate } from "react-router-dom";
import { useRegistrationStore } from "../../stores/registrationStore";
import { useBasicDataRegister } from "./hooks/useBasicDataRegister";

const basicDetailsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  ownerName: z.string().min(1, "Owner / Manager name is required"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
});

type BasicDetailsFormValues = z.infer<typeof basicDetailsSchema>;

export default function BasicDetails() {
  const navigate = useNavigate();
  const { address } = useRegistrationStore();
  const { setFormData, getFormData } = useRegistrationStore();
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);

  // API mutation hook
  const { mutate, isPending, error } = useBasicDataRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<BasicDetailsFormValues>({
    resolver: zodResolver(basicDetailsSchema),
    mode: "onSubmit",
    defaultValues: {
      storeName: getFormData().storeName || "",
      ownerName: getFormData().ownerName || "",
      phoneNumber: getFormData().phoneNumber || "",
    },
  });

  const onSubmit = async (data: BasicDetailsFormValues) => {
    // Validate address is selected
    if (!address) {
      console.warn("Address is required");
      return;
    }

    console.log("Submitting registration:", { ...data, address });

    // Trigger store registration API
    mutate({
      store_name: data.storeName,
      manager_name: data.ownerName,
      phone_number: data.phoneNumber,
      address: {
        address: address.name,
        lat: address.lat.toString(),
        lng: address.lng.toString(),
        postalCode: "",
        line_1: "",
        line_2: "",
        country: "",
        state_or_province: "",
        district: "",
        city: "",
        village: "",
        town: "",
        land_mark: "",
        instruction: "",
      },
      lat: address.lat.toString(),
      lng: address.lng.toString(),
    });
  };

  // Exposed submit function so the button (rendered outside the form) can trigger validation/submit
  const submitForm = handleSubmit(onSubmit);

  const handleAddAddress = () => {
    const { storeName, ownerName, phoneNumber } = getValues();

    // Save form data to Zustand
    setFormData({
      storeName,
      ownerName,
      phoneNumber,
    });

    // Navigate to map location, passing existing address coordinates if available
    navigate("/map-location", {
      state: address
        ? { lat: address.lat, lng: address.lng, existingAddress: address }
        : undefined,
    });
  };

  return (
    <div
      className="h-full px-2 flex flex-col"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <header className="py-2 mt-12 w-full">
        {/* Top Icon / Logo */}
        <div className="flex flex-col items-center mb-1">
          <img src={logo} alt="ClinicPe" className="h-20 mb-1" />
        </div>

        {/* Info Banner */}
        <div
          className="w-full max-w-mobile mx-auto rounded-lg p-2 mb-1"
          style={{ backgroundColor: "#D0E5FF" }}
        >
          <p
            className="text-sm text-[#0D52AF] font-semibold text-center"
            style={{ color: "#0D52AF" }}
          >
            Help Patient Book Doctor Appointment Easily
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center w-full">
        {/* Card */}
        <div className="rounded-lg p-0 w-full max-w-mobile mx-auto flex flex-col">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="space-y-3">
              {/* Store Name */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.black }}
                >
                  Store Name
                  <span style={{ color: colors.error }}>*</span>
                </label>
                <TextInput
                  placeholder="Enter your store name"
                  size="md"
                  error={errors.storeName?.message}
                  {...register("storeName")}
                  styles={{
                    input: {
                      borderColor: errors.storeName ? colors.error : "#E5E7EB",
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>

              {/* Owner / Manager Name */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.black }}
                >
                  Owner / Manager Name
                  <span style={{ color: colors.error }}>*</span>
                </label>
                <TextInput
                  placeholder="Enter owner / manager name"
                  size="md"
                  error={errors.ownerName?.message}
                  {...register("ownerName")}
                  styles={{
                    input: {
                      borderColor: errors.ownerName ? colors.error : "#E5E7EB",
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.black }}
                >
                  Phone Number
                </label>
                <div className="relative">
                  <TextInput
                    disabled={!isPhoneEditable}
                    placeholder="Enter phone number"
                    size="md"
                    inputMode="numeric"
                    maxLength={10}
                    error={errors.phoneNumber?.message}
                    {...register("phoneNumber")}
                    styles={{
                      input: {
                        borderColor: errors.phoneNumber
                          ? colors.error
                          : "#E5E7EB",
                        borderRadius: "8px",
                        backgroundColor: "#F9FAFB",
                      },
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setIsPhoneEditable(true)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke={colors.secondary}
                      strokeWidth="2"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0l-10 10V17h4.828l10-10a2 2 0 000-2.828z" />
                      <polyline points="7 13 13 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Add/Edit Address */}
              <div>
                {address ? (
                  <div
                    onClick={handleAddAddress}
                    className="w-full p-3 rounded-lg border-2 font-semibold flex items-start justify-between cursor-pointer transition-all hover:bg-blue-50"
                    style={{
                      borderColor: "#9ea5ad",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <div className="flex-1 text-left">
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: colors.secondary }}
                      >
                        Selected Location
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.primary }}
                      >
                        {address.name}
                      </p>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={colors.primary}
                      strokeWidth="2"
                      className="ml-2 shrink-0 mt-1"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0l-10 10V17h4.828l10-10a2 2 0 000-2.828z" />
                      <polyline points="7 13 13 7" />
                    </svg>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="w-full py-3 rounded-lg border-2 font-semibold text-center"
                    style={{
                      borderStyle: "dashed",
                      borderColor: colors.primary,
                      color: colors.primary,
                    }}
                  >
                    + Add Address
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Bottom Action Section (button sits lower) */}
      <div className="w-full mb-12 px-0 pb-4 mt-2">
        <div className="max-w-mobile mx-auto">
          {/* Error Message Display */}
          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: "#FEE2E2",
                color: colors.error,
                borderLeft: `4px solid ${colors.error}`,
              }}
            >
              {error instanceof Error
                ? error.message
                : "Failed to register store. Please try again."}
            </div>
          )}

          <Button
            type="button"
            fullWidth
            radius="md"
            className="font-semibold"
            onClick={submitForm}
            disabled={isPending || !address}
            loading={isPending}
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              padding: "12px",
              boxShadow: "0 6px 18px rgba(13,82,175,0.25)",
              opacity: isPending || !address ? 0.6 : 1,
            }}
          >
            {isPending ? "Registering..." : "Get Store Access"}
          </Button>

          {/* Footer Text */}
          <p
            className="text-xs text-center mt-4 mb-6"
            style={{ color: colors.secondary }}
          >
            No prescription or patient medical details are shared with medical
            store.
          </p>
        </div>
      </div>
    </div>
  );
}
