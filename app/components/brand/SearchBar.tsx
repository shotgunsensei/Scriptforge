export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[#F8FAFC]">
      Search
      <input
        className="border border-[#24304A] bg-[#0B1020] px-3 py-2 text-[#F8FAFC] outline-none focus:border-[#5E81F4]"
        defaultValue={defaultValue}
        name="q"
        placeholder="Search scripts, tools, categories"
      />
    </label>
  );
}
