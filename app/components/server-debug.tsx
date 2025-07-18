interface ServerDebugProps {
  data: unknown;
  label: string;
}

export function ServerDebug({ data, label }: ServerDebugProps) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <details className="mb-4 p-4 border border-gray-300 rounded">
      <summary className="cursor-pointer font-bold">🐛 Debug: {label}</summary>
      <pre className="mt-2 text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      <p>{JSON.stringify(process.env.NEXT_PUBLIC_API_URL)}</p>
      <p>{JSON.stringify(process.env.VERCEL_URL)}</p>
    </details>
  );
}
