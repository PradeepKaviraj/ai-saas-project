import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-zinc-800 p-6 rounded-xl">Card 1</div>
        <div className="bg-zinc-800 p-6 rounded-xl">Card 2</div>
        <div className="bg-zinc-800 p-6 rounded-xl">Card 3</div>
      </div>
    </DashboardLayout>
  );
}