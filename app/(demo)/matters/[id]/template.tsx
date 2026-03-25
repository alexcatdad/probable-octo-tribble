export default function MatterTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="matter-enter col-span-12 grid grid-cols-subgrid gap-y-5">
      {children}
    </div>
  );
}
