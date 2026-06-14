import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useState } from "react";

const lottieImports: Record<string, () => Promise<{ default: object }>> = {
  notfound: () => import("../../../assets/lotti/notfound.json"),
  cartloader: () => import("../../../assets/lotti/cartLoader.json"),
  empty: () => import("../../../assets/lotti/empty.json"),
  loading: () => import("../../../assets/lotti/loading.json"),
  error: () => import("../../../assets/lotti/error.json"),
  emptywish: () => import("../../../assets/lotti/emptywish.json"),
  success: () => import("../../../assets/lotti/success.json"),
};

type TLottieKey = keyof typeof lottieImports;

interface IlottiesProps {
  type: TLottieKey;
  message?: string;
}

function LottiesHandler({ type, message }: IlottiesProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;
    setAnimationData(null);
    lottieImports[type]().then((mod) => {
      if (!cancelled) setAnimationData(mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, [type]);

  const messageStyle =
    type === "error"
      ? { fontSize: "19px", color: "red", margin: "0px" }
      : { fontSize: "19px", marginTop: "30px", margin: "0px" };

  if (!animationData) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div className="spinner-border text-info" role="status" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <Player
        autoplay
        loop
        src={animationData}
        style={{ width: "400px", height: "400px" }}
      />
      {message && <h3 style={messageStyle}>{message}</h3>}
    </div>
  );
}

export default LottiesHandler;
