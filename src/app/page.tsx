import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-white">⚡ AI SaaS</h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:border-blue-500 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <main className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20">

        <div className="inline-block bg-blue-600/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-1 rounded-full mb-6">
          Powered by LLaMA 3.1 via OpenRouter
        </div>

        <h1 className="text-5xl font-bold leading-tight max-w-3xl mb-6">
          Your Personal{" "}
          <span className="text-blue-500">AI Assistant</span>{" "}
          for Content & Ideas
        </h1>

        <p className="text-zinc-400 text-lg max-w-xl mb-10">
          Generate LinkedIn posts, brainstorm ideas, craft answers — all in one
          intelligent dashboard. Your chat history is saved automatically.
        </p>

        <div className="flex gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
          >
            Start for Free →
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 rounded-lg text-zinc-300 transition"
          >
            Login
          </Link>
        </div>
      </main>

      {/* FEATURES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 pb-20 max-w-5xl mx-auto w-full">
        {[
          {
            icon: "🤖",
            title: "AI Powered",
            desc: "Built on LLaMA 3.1 — fast, free, and intelligent responses.",
          },
          {
            icon: "💬",
            title: "Chat History",
            desc: "Every conversation is saved. Pick up right where you left off.",
          },
          {
            icon: "🔒",
            title: "Secure Auth",
            desc: "JWT-based authentication with encrypted passwords.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-blue-500/50 transition"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-white font-semibold text-lg mb-2">
              {feature.title}
            </h3>
            <p className="text-zinc-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="text-center text-zinc-600 text-sm pb-6">
        Built with Next.js · TypeScript · MongoDB · OpenRouter
      </footer>

    </div>
  );
}