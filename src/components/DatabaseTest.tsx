import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function DatabaseTest() {
  const [status, setStatus] = useState<
    "testing" | "connected" | "error" | "needs-setup"
  >("testing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus("testing");
      setMessage("Testing database connection...");

      // Test if we can query the tasks table
      const { error } = await supabase.from("tasks").select("count").limit(1);

      if (error) {
        if (error.message.includes('relation "tasks" does not exist')) {
          setStatus("needs-setup");
          setMessage(
            "Database tables need to be created. Please run the SQL setup."
          );
        } else {
          setStatus("error");
          setMessage(`Connection error: ${error.message}`);
        }
      } else {
        setStatus("connected");
        setMessage("Successfully connected to Supabase database!");
      }
    } catch (err) {
      setStatus("error");
      setMessage(`Failed to connect: ${err}`);
    }
  };

  const createTestTask = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title: "Test Task from Database",
            description: "This is a test task created in Supabase",
            priority: "medium",
            completed: false,
            user_id: "anonymous",
          },
        ])
        .select()
        .single();

      if (error) {
        setMessage(`Failed to create test task: ${error.message}`);
      } else {
        setMessage(`✅ Test task created successfully! ID: ${data.id}`);
      }
    } catch (err) {
      setMessage(`Error creating test task: ${err}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Database Connection Status</h2>

      <div className="mb-4">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            status === "connected"
              ? "bg-green-100 text-green-800"
              : status === "error"
              ? "bg-red-100 text-red-800"
              : status === "needs-setup"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {status === "testing" && "🔄"}
          {status === "connected" && "✅"}
          {status === "error" && "❌"}
          {status === "needs-setup" && "⚠️"}
          <span className="ml-2 capitalize">{status.replace("-", " ")}</span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{message}</p>

      <div className="space-x-2">
        <button
          onClick={testConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Connection
        </button>

        {status === "connected" && (
          <button
            onClick={createTestTask}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Test Task
          </button>
        )}
      </div>

      {status === "needs-setup" && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold mb-2">Setup Required:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>
              Go to your{" "}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Supabase Dashboard
              </a>
            </li>
            <li>
              Select your project:{" "}
              <code className="bg-gray-100 px-1 rounded">
                gruflpyemphtthyswwnj
              </code>
            </li>
            <li>Go to SQL Editor</li>
            <li>
              Copy and run the SQL from{" "}
              <code className="bg-gray-100 px-1 rounded">
                database-setup.sql
              </code>
            </li>
            <li>Click "Test Connection" again</li>
          </ol>
        </div>
      )}
    </div>
  );
}
