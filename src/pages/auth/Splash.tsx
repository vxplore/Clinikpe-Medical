import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate splash screen duration
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-full bg-gradient-to-br from-primary to-blue-600 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8 animate-float-slow">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto">
            <span className="text-4xl font-bold text-primary">C</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Clinik-pe</h1>
        <p className="text-blue-100 mb-8">Medical Management System</p>
        <Loader className="animate-spin text-white mx-auto" size={32} />
      </div>
    </div>
  );
}
