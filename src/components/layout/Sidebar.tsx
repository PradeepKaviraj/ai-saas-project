// Sidebar.tsx
export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-zinc-900 p-5">
      <h1 className="text-xl font-bold mb-8">AI SaaS</h1>

      <nav className="flex flex-col gap-4">
        <a href="/" className="hover:text-blue-400">Dashboard</a>
        <a href="#" className="hover:text-blue-400">AI Chat</a>
        <a href="#" className="hover:text-blue-400">Settings</a>
      </nav>
    </div>
  );
}