'use client';
import Link from 'next/link';
import { FaShoppingBag, FaClipboardList, FaChartBar, FaUsers } from 'react-icons/fa';

export default function DashboardLayout({ children }) {
  const menuItems = [
    { name: 'Dashboard', icon: FaChartBar, href: '/dashboard' },
    { name: 'Categories', icon: FaChartBar, href: '/dashboard/categories' },
    { name: 'Products', icon: FaShoppingBag, href: '/dashboard/products' },
    { name: 'Orders', icon: FaClipboardList, href: '/dashboard/orders' },
    { name: 'Users', icon: FaUsers, href: '/dashboard/users' }
  ];

  return (
    <div className='flex min-h-screen bg-white'>
      {/* Sidebar */}
      <div className='fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto'>
        <div className='p-6'>
          <h1 className='text-2xl font-bold text-black mb-8'>Taj Royals Admin</h1>
          <nav className='space-y-2'>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='flex items-center gap-3 px-4 py-3 text-black hover:bg-gray-100 rounded-lg transition-colors'
              >
                <item.icon className='w-5 h-5' />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 ml-64'>
        {/* Header */}
        <header className='bg-white border-b border-gray-200'>
          <div className='px-6 py-4'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold text-black'>Dashboard</h2>
              <div className='flex items-center gap-4'>
                <span className='text-sm text-black'>Admin User</span>
                <button className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800'>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='p-6 bg-white'>
          {children}
        </main>
      </div>
    </div>
  );
}
