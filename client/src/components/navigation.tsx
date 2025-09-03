import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useLocation, Link } from 'wouter';

const navItems = [
  { href: '/', label: 'HOME' },
  { href: '/rules', label: 'RULES' },
  { href: '/join', label: 'JOIN' },
  { href: '/killfeed', label: 'KILL FEED' },
  { href: '/donate', label: 'DONATE' },
  { href: '/support', label: 'SUPPORT' },
  { href: '/admin', label: 'ADMIN' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-red-600/60 shadow-lg shadow-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <img src="/attached_assets/AggroNewest-modified_1750723004646.png" alt="Aggro PvP Logo" className="h-12 w-auto cursor-pointer" />
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover-blood relative px-3 py-2 text-sm font-rajdhani font-medium transition-colors ${
                  location === item.href ? 'text-red-400' : 'text-gray-100 hover:text-red-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2 hover:text-red-500 transition-colors">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-red-600/30">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-left px-4 py-2 text-lg font-rajdhani font-medium text-gray-100 hover:text-red-400 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
