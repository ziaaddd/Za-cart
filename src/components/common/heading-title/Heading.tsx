const Heading = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="fw-bold  mb-4 " style={{ color: "#0dcaf0" }}>
      {children}
    </h2>
  );
};

export default Heading;
