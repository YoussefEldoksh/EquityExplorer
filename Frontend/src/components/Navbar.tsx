import { useIsMobile } from '../hooks/use-mobile'
import { Button } from './ui/button'
import { Field } from './ui/field'
import { Input } from './ui/input'
import { useState, type ChangeEvent, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useEffect } from 'react';
import { House, LogIn, MailQuestionMark, Tv } from 'lucide-react';
import logo1 from '@/assets/logos/EE-black-logo.jpeg'
import logo2 from '@/assets/logos/EE-logo-white.png'

import { motion } from 'framer-motion'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer'

import { useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isOtherPage = location.pathname !== '/';
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' },
    { label: 'Screener', ariaLabel: 'Get in touch', link: '/tickerslist' },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const navigate = useNavigate();
  const lastY = useRef(0);


  useEffect(() => {
    const handleScroll = () => {

      const y = window.scrollY;
      setScrolledDown(y > lastY.current || y > 50);
      lastY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`/api/auth/logout.php`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      window.dispatchEvent(new Event('auth'));
      setDrawerOpen(false);
      navigate('/signin');
    }
  };

  const isMobile = useIsMobile();
  const [searchWord, setSearchWord] = useState("");
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [user, setUser] = useState<{ username?: string } | null>(null);
  const [suggestions, setSuggestions] = useState<{ symbol: string; name: string }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
    setShowSuggestions(true);
  };

  const selectTicker = (symbol: string) => {
    setSearchWord("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/${symbol.toUpperCase()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        e.preventDefault();
        selectTicker(suggestions[selectedIndex].symbol);
      } else if (searchWord.trim()) {
        selectTicker(searchWord);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchWord.trim().length > 1) {
        try {
          const response = await fetch(`/api/search/suggestions?q=${searchWord}`);
          const data = await response.json();
          setSuggestions(data);
          setSelectedIndex(-1);
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchWord]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`/api/auth/me.php`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setIsAuthed(data.success === true);
        setUser(data.user || null);
      } catch (error) {
        setIsAuthed(false);
        setUser(null);
      }
    };

    checkAuth();

    window.addEventListener('auth', checkAuth);
    return () => {
      window.removeEventListener('auth', checkAuth);
    };
  }, []);

  return (
    <>
      {
        !isMobile &&
        <>
          <motion.div
            className={`fixed top-0 right-0 left-0 z-50 flex flex-col justify-between transition-all duration-300 ${scrolledDown
              ? 'bg-white shadow-md '
              : 'bg-transparent'
              }`}
            animate={{ y: scrolledDown  ? '-100%' : '0%' }}
            transition={{ duration: 0.3 }}
          >
            <nav className="w-full flex px-10 py-4 justify-between items-center">
              <motion.div className='flex gap-2 items-center h-fit '
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}

              >
                <div className='h-full w-8 object-contain'>
                  <img src={logo2} alt="" className='' />
                </div>
                <Link to="/">
                  <p className="font-excon text-xl font-bold text-black">EquityExplorer</p>
                </Link>
              </motion.div>

              <div className="flex items-center gap-3 px-5 font-bold">
                <Link to="/contact">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="font-outfit font-medium rounded-xl text-lg bg-transparent border-none text-black hover:bg-black/5">
                    Contact
                  </motion.button>
                </Link>
                <Link to="/tickerslist">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="font-outfit font-medium rounded-xl text-lg bg-transparent border-none text-black hover:bg-black/5">
                    Screener
                  </motion.button>
                </Link>
                <Link to="/tickerslist">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                    className="font-outfit font-medium rounded-xl text-lg bg-transparent border-none text-black hover:bg-black/5">
                    About
                  </motion.button>
                </Link>
                <Link to="/tickerslist">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                    className="font-outfit font-medium rounded-xl text-lg bg-transparent border-none text-black hover:bg-black/5">
                    Methodology
                  </motion.button>
                </Link>
              </div>

              <div className="flex relative items-center">
                <Field orientation="horizontal" className="w-120 flex gap-0 font-outfit">
                  <Input
                    type="search"
                    placeholder="Search Symbol or Company..."
                    value={searchWord}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    className="rounded-l-lg border-none placeholder-gray-400  text-xl text-black bg-black/5"
                  />
                  <Button
                    onClick={() => selectTicker(searchWord)}
                    className="hover:text-black hover:bg-white py-4  rounded-r-lg"
                  >
                    Search
                  </Button>
                </Field>

                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-md shadow-lg z-[100] mt-1 overflow-hidden"
                  >
                    {suggestions.map((item, index) => (
                      <div
                        key={item.symbol}
                        onClick={() => selectTicker(item.symbol)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors ${selectedIndex === index ? "bg-gray-100 text-black" : "text-gray-700"
                          }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{item.symbol}</span>
                          <span className="text-xs text-gray-500 truncate max-w-[200px]">{item.name}</span>
                        </div>
                        <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-600 font-medium">STOCK</span>
                      </div>
                    ))}
                  </div>
                )}

                {isAuthed ? (
                  <UserMenu username={user?.username} className="ml-5" />
                ) : (
                  <>
                    <div className='flex gap-2 mx-2'>

                      <Link to="/signin">
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.3, ease: 'easeInOut' }}
                          className="font-outfit font-medium rounded-xl text-black text-lg border-none bg-transparent hover:bg-black/5">
                          Sign-in
                        </motion.button>
                      </Link>
                      <Link to="/register">
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.5, ease: 'easeInOut' }}
                          className="font-outfit font-medium rounded-xl text-black text-lg border-none bg-transparent hover:bg-black/5">
                          Register
                        </motion.button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        </>
      }

      {/* Mobile navbar — unchanged */}
      {isMobile && (
        <>
          <motion.div className={`fixed bottom-0 right-0 left-0 z-50 flex flex-col justify-between border-none`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <nav className={`
              ${isOtherPage ? "bg-white/10 backdrop-blur-md border-slate-200 border" : "bg-black backdrop-blur-md"}
              flex px-5 py-4 items-center justify-between shadow ${isOtherPage ? "text-black font-bold" : "text-white"}
            `}>
              <div className={`flex gap-10 px-2`}>
                <Link to="/">
                  <motion.div whileHover={{ scale: 1.05 }} className={`flex flex-col items-center`}>
                    <House />
                    <p className={`font-excon mt-1 text-xs font-bold`}>Home</p>
                  </motion.div>
                </Link>
                <Link to="/tickerslist">
                  <div className='flex flex-col items-center'>
                    <Tv />
                    <p className={`font-excon mt-1 text-xs font-bold`}>Stocks</p>
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction={"right"} modal={false}>
                  <DrawerTrigger asChild>
                    {isOtherPage ? (
                      <div className='bg-black p-1 rounded-4xl hover:bg-[#4335d6] object-contain'>
                        <img src={logo2} alt="" className='w-11 h-11 object-contain' />
                      </div>
                    ) : (
                      <div className='bg-white p-2 rounded-4xl hover:bg-[#4335d6] object-contain'>
                        <img src={logo1} alt="" className='w-8 h-8 object-contain mix-blend-multiply' />
                      </div>
                    )}
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="sr-only">
                      <DrawerTitle>Navigation Menu</DrawerTitle>
                      <DrawerDescription>Browse stocks and manage your account</DrawerDescription>
                    </DrawerHeader>
                    <div className='flex flex-col sm:flex-row px-3 sm:px-5 pt-3 sm:pt-10 relative gap-2 font-excon w-full'>
                      <Field orientation="horizontal" className="w-full flex gap-0">
                        <Input
                          type="search"
                          placeholder="Search..."
                          value={searchWord}
                          onChange={handleSearchChange}
                          onKeyDown={handleKeyDown}
                          onFocus={() => setShowSuggestions(true)}
                          className={`bg-black/5 rounded-l-lg text-xs`}
                        />
                        <Button
                          onClick={() => { selectTicker(searchWord); setDrawerOpen(false); }}
                          className="hover:text-black hover:bg-white rounded-r-lg text-xs"
                        >
                          Search
                        </Button>
                      </Field>
                      {showSuggestions && suggestions.length > 0 && (
                        <div
                          ref={dropdownRef}
                          className="absolute top-[calc(100%-10px)] left-3 sm:left-5 right-3 sm:right-5 bg-white border border-gray-200 rounded-md shadow-lg z-[100] overflow-hidden max-h-48 overflow-y-auto"
                        >
                          {suggestions.map((item, index) => (
                            <div
                              key={item.symbol}
                              onClick={() => { selectTicker(item.symbol); setDrawerOpen(false); }}
                              onMouseEnter={() => setSelectedIndex(index)}
                              className={`px-3 sm:px-4 py-2 sm:py-3 cursor-pointer flex justify-between items-center text-xs ${selectedIndex === index ? "bg-gray-100" : ""}`}
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-xs text-black truncate">{item.symbol}</span>
                                <span className="text-xs text-gray-500 truncate">{item.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 px-3 sm:px-4 py-2 sm:py-2 pt-3 sm:pt-5">
                      {(() => {
                        const list = [...menuItems];
                        if (!isAuthed) {
                          list.splice(1, 0, { label: 'Sign In', ariaLabel: 'Sign in', link: '/signin' });
                          list.splice(2, 0, { label: 'Register', ariaLabel: 'Register', link: '/register' });
                        } else {
                          list.push({ label: 'Watchlist', ariaLabel: 'Watchlist', link: '/watchlist' });
                          list.push({ label: 'Alerts', ariaLabel: 'Alerts', link: '/alerts' });
                          list.push({ label: 'Settings', ariaLabel: 'Settings', link: '/settings' });
                        }
                        return (
                          <>
                            {list.map((item) => (
                              <Link key={item.label} to={item.link} onClick={() => setDrawerOpen(false)}>
                                <p className="w-full font-excon uppercase font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl active:text-[#4335d6] hover:text-[#4335d6] underline">{item.label}</p>
                              </Link>
                            ))}
                            {isAuthed && (
                              <button onClick={handleLogout} className="text-left w-full font-excon uppercase font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-red-600 hover:text-red-700">
                                LOGOUT
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>

              <div className='flex gap-10 px-2'>
                <Link to="/contact">
                  <div className='flex flex-col items-center'>
                    <MailQuestionMark />
                    <p className={`font-excon mt-1 text-xs font-bold`}>Contact</p>
                  </div>
                </Link>
                {isAuthed ? (
                  <UserMenu className="shrink-0" username={user?.username} />
                ) : (
                  <Link to="/signin">
                    <div className='flex flex-col items-center'>
                      <LogIn />
                      <p className={`font-excon mt-1 text-xs font-bold text-center`}>Signin</p>
                    </div>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </>
  )
}

export default Navbar