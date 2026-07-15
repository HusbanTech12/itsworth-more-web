"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface ShippingFormData {
  name: string;
  email: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface ShippingFormProps {
  data: ShippingFormData;
  onChange: (data: ShippingFormData) => void;
  errors: Partial<Record<keyof ShippingFormData, string>>;
}

const usStates = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export function ShippingForm({ data, onChange, errors }: ShippingFormProps) {
  function update(field: keyof ShippingFormData, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-900">Shipping Address</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            error={errors.name}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Street Address"
            placeholder="123 Main St"
            value={data.street}
            onChange={(e) => update("street", e.target.value)}
            error={errors.street}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Apt, Suite, etc. (optional)"
            placeholder="Apt 4B"
            value={data.street2}
            onChange={(e) => update("street2", e.target.value)}
          />
        </div>

        <Input
          label="City"
          placeholder="Sanford"
          value={data.city}
          onChange={(e) => update("city", e.target.value)}
          error={errors.city}
        />

        <Select
          label="State"
          placeholder="Select state"
          value={data.state}
          onChange={(e) => update("state", e.target.value)}
          options={usStates}
          error={errors.state}
        />

        <Input
          label="ZIP Code"
          placeholder="32771"
          value={data.zip}
          onChange={(e) => update("zip", e.target.value)}
          error={errors.zip}
          helperText="US ZIP or UK postcode format"
        />

        <Select
          label="Country"
          value={data.country}
          onChange={(e) => update("country", e.target.value)}
          options={[
            { value: "US", label: "United States" },
            { value: "UK", label: "United Kingdom" },
          ]}
          error={errors.country}
        />

        <div className="sm:col-span-2">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="(555) 123-4567"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            error={errors.phone}
          />
        </div>
      </div>
    </div>
  );
}
