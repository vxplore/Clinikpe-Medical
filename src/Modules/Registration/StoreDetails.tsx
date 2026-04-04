import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, Button, Card } from "@mantine/core";
import { Edit2 } from "lucide-react";
import logo from "../../assets/Logo.svg";
import {
  storeDetailsSchema,
  type StoreDetailsFormData,
} from "./storeDetailsSchema";

const StoreDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(storeDetailsSchema),
    defaultValues: {
      storeName: "",
      ownerName: "",
      phoneNumber: "+91 ",
      address: "",
    },
  } as any);

  const addressValue = watch("address");
  const defaultAddress =
    "95, Bireswar Chatterjee Street Near Jain Mandir Hapta Bazar, Bally Khal Bally, Howrah West Bengal - 711201";

  const onSubmit = (data: StoreDetailsFormData) => {
    console.log("Form submitted:", data);
    // Handle form submission
  };

  return (
    <div className="h-full p-0 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-lg">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <img src={logo} alt="ClinicPe" className="h-20 mb-2 mx-auto" />
        </div>

        {/* Info Alert */}
        <div
          className="w-full max-w-mobile mx-auto rounded-lg p-2 mb-4"
          style={{ backgroundColor: "#D0E5FF" }}
        >
          <p
            className="text-sm text-[#0D52AF] font-semibold text-center"
            style={{ color: "#0D52AF" }}
          >
            Help Patient Book Doctor Appointment Easily
          </p>
        </div>

        {/* Form Fields */}
        <form
          onSubmit={handleSubmit((data: any) => onSubmit(data))}
          className="space-y-5"
        >
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Store Name <span className="text-red-500">*</span>
            </label>
            <TextInput
              size="md"
              radius="md"
              placeholder="Enter your store name"
              {...register("storeName")}
              error={errors.storeName?.message as unknown as string}
              classNames={{
                input: "border-gray-300 focus:border-blue-500",
              }}
            />
          </div>

          {/* Owner / Manager Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Owner / Manager Name <span className="text-red-500">*</span>
            </label>
            <TextInput
              size="md"
              radius="md"
              placeholder="Enter owner / manager name"
              {...register("ownerName")}
              error={errors.ownerName?.message as unknown as string}
              classNames={{
                input: "border-gray-300 focus:border-blue-500",
              }}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <TextInput
                size="md"
                radius="md"
                placeholder="+91 8106664569"
                {...register("phoneNumber")}
                error={errors.phoneNumber?.message as unknown as string}
                classNames={{
                  input: "border-gray-300 focus:border-blue-500 pr-10",
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Edit2 size={18} />
              </button>
            </div>
          </div>

          {/* Added Address */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-900">
                Added Address
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit2 size={18} />
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-500">
                {addressValue || defaultAddress}
              </p>
            </div>
          </div>

          {/* Get Store Access Button */}
          <Button
            radius="md"
            type="submit"
            fullWidth
            size="lg"
            style={{ backgroundColor: "#2563EB" }}
            className="mt-8 font-semibold rounded-lg"
          >
            Get Store Access
          </Button>
        </form>

        {/* Disclaimer Text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          No prescription or patient medical details are shared with medical
          store.
        </p>
      </Card>
    </div>
  );
};

export default StoreDetails;
