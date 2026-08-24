type AdminCmsAlertsProps = {
  error?: string;
  success?: string;
};

export default function AdminCmsAlerts({ error, success }: AdminCmsAlertsProps) {
  if (!error && !success) return null;

  return (
    <div className="mb-4 space-y-3">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-lg border border-[#7cd244]/40 bg-[#7cd244]/10 px-4 py-3 text-sm text-[#3f7220]">
          {success}
        </div>
      ) : null}
    </div>
  );
}
