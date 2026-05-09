import React from "react";
import "./App.css";
export default function App() {
  const [errorLog, setErrorLog] = React.useState("");
  const [response, setResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const analyzeError = async () => {
    if (!errorLog.trim()) {
      setError("Please paste an error log first.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const result = await fetch(
        "https://localhost:7080/api/debug/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            errorLog: errorLog,
          }),
        }
      );

      const data = await result.json();
      setResponse(data);
    } catch (err) {
      setError("Failed to connect to AI Debugger API.");
      console.error(err);
    }

    setLoading(false);
  };

  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      default:
        return "bg-green-500/20 text-green-300 border border-green-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI API Debugger
          </h1>

          <p className="text-slate-400 text-lg">
            Analyze .NET & API errors using AI-powered root cause detection.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Error Input</h2>

              <span className="text-sm px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AI Ready
              </span>
            </div>

            <textarea
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              placeholder="Paste your .NET or API error log here..."
              className="w-full h-[350px] bg-[#020617] border border-slate-700 rounded-2xl p-4 text-sm font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />

            <div className="mt-6 flex gap-4">
              <button
                onClick={analyzeError}
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 text-black font-semibold px-6 py-3 rounded-2xl shadow-lg disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Analyze Error"}
              </button>

              <button
                onClick={() => {
                  setErrorLog("");
                  setResponse(null);
                  setError("");
                }}
                className="bg-slate-800 hover:bg-slate-700 transition-all duration-300 px-6 py-3 rounded-2xl"
              >
                Clear
              </button>
            </div>

            {error && (
              <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-2xl">
                {error}
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">AI Analysis</h2>

              {response?.severity && (
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getSeverityStyle(
                    response.severity
                  )}`}
                >
                  {response.severity} Severity
                </span>
              )}
            </div>

            {!response && !loading && (
              <div className="h-[450px] flex items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
                AI analysis will appear here...
              </div>
            )}

            {loading && (
              <div className="h-[450px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>

                <p className="mt-6 text-slate-400 text-lg">
                  AI is analyzing your error...
                </p>
              </div>
            )}

            {response && !loading && (
              <div className="space-y-5">
                <div className="bg-[#020617] border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-cyan-400 font-semibold text-lg mb-2">
                    Explanation
                  </h3>

                  <p className="text-slate-300 leading-7">
                    {response.Explanation}
                  </p>
                </div>

                <div className="bg-[#020617] border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-yellow-400 font-semibold text-lg mb-2">
                    Root Cause
                  </h3>

                  <p className="text-slate-300 leading-7">
                    {response.RootCause}
                  </p>
                </div>

                <div className="bg-[#020617] border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-green-400 font-semibold text-lg">
                      Fix Suggestion
                    </h3>

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          response.FixSuggestion || ""
                        )
                      }
                      className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg"
                    >
                      Copy
                    </button>
                  </div>

                  <p className="text-slate-300 leading-7 whitespace-pre-line">
                    {response.FixSuggestion}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-slate-500 text-sm">
          Built using React + .NET 10 + AI Integration
        </div>
      </div>
    </div>
  );
}

