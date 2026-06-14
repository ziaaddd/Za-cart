import ContentLoader from "react-content-loader";

// Renders 3 order card skeletons stacked vertically
const OrdersSkeleton = () => (
  <div className="d-flex flex-column gap-3">
    {[1, 2, 3].map((i) => (
      <ContentLoader
        key={i}
        speed={2}
        width="100%"
        height={110}
        viewBox="0 0 700 110"
        backgroundColor="#f5f4f4"
        foregroundColor="#ecebeb"
      >
        {/* Order number + date */}
        <rect x="0" y="16" rx="4" ry="4" width="160" height="16" />
        <rect x="540" y="16" rx="4" ry="4" width="140" height="16" />
        {/* Status badge */}
        <rect x="0" y="48" rx="12" ry="12" width="90" height="26" />
        {/* Total */}
        <rect x="540" y="48" rx="4" ry="4" width="140" height="26" />
        {/* Divider + expand hint */}
        <rect x="0" y="88" rx="4" ry="4" width="700" height="1" />
        <rect x="0" y="94" rx="4" ry="4" width="100" height="12" />
      </ContentLoader>
    ))}
  </div>
);

export default OrdersSkeleton;
