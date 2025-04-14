export default function LocationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Location Settings</h1>

      <div className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="address">
            Address
          </label>
          <input
            className="px-3 py-2 border rounded-md"
            defaultValue="123 Main St"
            id="address"
            type="text"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="city">
            City
          </label>
          <input
            className="px-3 py-2 border rounded-md"
            defaultValue="San Francisco"
            id="city"
            type="text"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="state">
              State
            </label>
            <input
              className="px-3 py-2 border rounded-md"
              defaultValue="CA"
              id="state"
              type="text"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="zip">
              ZIP Code
            </label>
            <input
              className="px-3 py-2 border rounded-md"
              defaultValue="94105"
              id="zip"
              type="text"
            />
          </div>
        </div>

        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Save Address
        </button>
      </div>
    </div>
  );
}
