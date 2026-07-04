import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 }
];

export default function AdminLayout() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0 hidden lg:block">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-1.5">
              <Package className="h-5 w-5 text-gray-900" />
            </div>
            <span className="text-lg font-bold text-white">
              Shop<span className="text-blue-400">Sphere</span>
            </span>
          </a>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
              {(profile?.name || 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.name}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </a>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-2 mt-1 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-black rounded-lg p-1.5">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">
              Shop<span className="text-blue-600">Sphere</span>
            </span>
          </a>
        </header>

        {/* Mobile Nav */}
        <nav className="lg:hidden bg-white border-b border-gray-200 px-4 py-2 flex overflow-x-auto gap-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
