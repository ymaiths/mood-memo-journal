
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="flex justify-center mb-6 border-b">
      <div className="flex space-x-8">
        <Link
          to="/"
          className={cn(
            "px-4 py-2 -mb-px text-sm font-medium transition-colors",
            "hover:text-primary",
            location.pathname === "/" && "border-b-2 border-primary text-primary"
          )}
        >
          ปฏิทิน
        </Link>
        <Link
          to="/analytics"
          className={cn(
            "px-4 py-2 -mb-px text-sm font-medium transition-colors",
            "hover:text-primary",
            location.pathname === "/analytics" && "border-b-2 border-primary text-primary"
          )}
        >
          สถิติอารมณ์
        </Link>
      </div>
    </nav>
  );
}
