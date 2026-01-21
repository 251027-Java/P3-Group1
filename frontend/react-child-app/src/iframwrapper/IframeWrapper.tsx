import { useLocation } from "react-router-dom";


const IframeWrapper = ({ baseUrl }: { baseUrl: string }) => {
  const location = useLocation();

  // 1. Ensure we don't end up with double slashes (e.g., http://localhost:4200//profile)
  const subPath = location.pathname.replace('/angular', '').replace(/\/$/, "");
  const finalUrl = `${baseUrl}${subPath}`;

  return (
    <div style={{
      width: '100vw',           // Use viewport width to be 100% sure
      height: 'calc(100vh - 72px)',
      overflow: 'hidden',
      display: 'block'          // Ensure it's not behaving like an inline element
    }}>
      <iframe
        src={finalUrl}
        key={baseUrl}
        title="Angular MFE"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          minWidth: '100%'      // Force the width
        }}
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
};

export default IframeWrapper;