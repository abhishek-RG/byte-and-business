
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { LogOut, User, Loader2 } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, profile, logout, isLoading } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-2">
        <Link to="/" className="text-2xl font-bold text-relief-darkCharcoal flex items-center">
          <span className="text-relief-darkGreen mr-1">Relief</span>Chain
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 size={16} className="text-relief-darkCharcoal animate-spin mr-2" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : user ? (
          <>
            <div className="hidden md:flex items-center space-x-2">
              <User size={18} className="text-relief-darkCharcoal" />
              <span className="text-sm font-medium text-relief-darkCharcoal">
                {profile?.name || user.email} ({profile?.role})
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center space-x-1"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={handleLoginClick}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
