import { getOneidaCountyAlerts } from '@/lib/weather';
import type { WeatherAlert } from '@/lib/models';

function getSeverityColor(severity?: string): string {
  switch (severity?.toLowerCase()) {
    case 'extreme':
      return 'bg-red-700 border-red-800';
    case 'severe':
      return 'bg-orange-600 border-orange-700';
    case 'moderate':
      return 'bg-yellow-500 border-yellow-600';
    case 'minor':
      return 'bg-blue-500 border-blue-600';
    default:
      return 'bg-gray-600 border-gray-700';
  }
}

function formatAlertTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return '';
  }
}

function AlertCard({ alert }: { alert: WeatherAlert }) {
  const severityColors = getSeverityColor(alert.severity);
  
  return (
    <div className={`${severityColors} text-white p-4 rounded-lg border-2 shadow-lg`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚠️</span>
            <h4 className="font-bold text-lg">{alert.event}</h4>
          </div>
          
          {alert.headline && (
            <p className="font-semibold mb-2">{alert.headline}</p>
          )}
          
          {alert.areaDesc && (
            <p className="text-sm opacity-90 mb-2">
              <strong>Areas:</strong> {alert.areaDesc}
            </p>
          )}
          
          <div className="text-sm opacity-90 space-y-1">
            {alert.effective && (
              <p><strong>Effective:</strong> {formatAlertTime(alert.effective)}</p>
            )}
            {alert.expires && (
              <p><strong>Expires:</strong> {formatAlertTime(alert.expires)}</p>
            )}
          </div>
          
          {alert.description && (
            <details className="mt-3">
              <summary className="cursor-pointer font-medium hover:underline">
                View full details
              </summary>
              <div className="mt-2 space-y-2 text-sm">
                <p className="whitespace-pre-wrap">{alert.description}</p>
                {alert.instruction && (
                  <div className="bg-white/10 p-2 rounded">
                    <p className="font-semibold mb-1">Instructions:</p>
                    <p className="whitespace-pre-wrap">{alert.instruction}</p>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
        
        {alert.severity && (
          <span className="text-xs font-bold uppercase bg-white/20 px-2 py-1 rounded">
            {alert.severity}
          </span>
        )}
      </div>
    </div>
  );
}

export default async function AlertsBanner() {
  const alerts = await getOneidaCountyAlerts();
  
  if (alerts.length === 0) {
    return null;
  }
  
  return (
    <section aria-labelledby="alerts-heading" className="mb-6">
      <h2 id="alerts-heading" className="sr-only">Weather Alerts</h2>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </section>
  );
}
