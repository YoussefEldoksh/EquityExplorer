import { useIsMobile } from '../hooks/use-mobile'
import { Button } from './ui/button'
import { Field } from './ui/field'
import { Input } from './ui/input'
import { useState, type ChangeEvent, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useEffect } from 'react';
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
  const navigate = useNavigate();

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
          <div className={`fixed top-0 right-0 left-0 z-50 flex flex-col justify-between p-5 `}>


            <nav className={` w-full flex px-10 py-5 rounded-xl shadow  justify-between border ${isOtherPage ? "bg-white/10 backdrop-blur-md border-slate-200" : "bg-black/40 backdrop-blur-md border-white/20"}`}>
              <div className=''>
                <Link to="/">
                  <p className={` font-excon text-xl font-bold ${isOtherPage ? "text-black" : "text-white"}`} >EquityExplorer</p>
                </Link>

              </div>



              <div className='flex items-center gap-3 px-5 font-bold text-white '>
                <Link to="/contact">
                  <Button className={`font-excon rounded-xl   text-lg  bg-transparent border-none text-white  ${isOtherPage ? "text-black hover:text-white hover:bg-black" : "text-white  hover:text-black hover:bg-white"}` }>Contact</Button>
                </Link>
                <Link to="/tickerslist">
                  <Button className={`font-excon rounded-xl text-white bg-black text-lg  border-none bg-transparent  ${isOtherPage ? "text-black hover:text-white hover:bg-black" : "text-white hover:text-black hover:bg-white"}`} >Screener</Button>
                </Link>
                <Link to="/tickerslist">
                  <Button className={`font-excon rounded-xl text-white bg-black text-lg  border-none bg-transparent  ${isOtherPage ? "text-black hover:text-white hover:bg-black" : "text-white hover:text-black hover:bg-white"}`} >About</Button>
                </Link>
                <Link to="/tickerslist">
                  <Button className={`font-excon rounded-xl text-white bg-black text-lg  border-none bg-transparent  ${isOtherPage ? "text-black hover:text-white hover:bg-black" : "text-white hover:text-black hover:bg-white"}`} >Methodology</Button>
                </Link>

              </div>
              <div className='flex relative'>

                <Field orientation="horizontal" className="w-120 flex  gap-0" >
                  <Input type="search" placeholder="Search Symbol or Company..."
                    value={searchWord}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    className={`rounded-l-lg  border-none  placeholder-gray-100 font-excon text-xl ${isOtherPage ? "text-black bg-black/5" : "text-white bg-black/70" }`}
                  />

                  <Button
                    onClick={() => selectTicker(searchWord)}
                    className="hover:text-black hover:bg-white py-4 font-excon rounded-r-lg"
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
                {isAuthed ?
                (<UserMenu username={user?.username} className='ml-5'/>)
                :
                  (                 
                  <>
                    <Link to="/signin">
                      <Button variant="outline" className={`font-excon rounded-xl text-white bg-black text-lg  border-none bg-transparent  ${isOtherPage ? "text-black hover:text-white hover:bg-black" : "text-white hover:text-black hover:bg-white"}`} >
                        Sign-in
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="outline" className={`font-excon rounded-xl text-white bg-black text-lg  border-none bg-transparent  ${isOtherPage ? "text-black hover:text-white hover:bg-black" : "text-white hover:text-black hover:bg-white"}`} >
                        Register
                      </Button>
                    </Link>
                  </>)
                }
              </div>
            </nav>
          </div>
        </>
      }
      {isMobile && (
        <>
          <div className={`fixed top-0 right-0 left-0 z-50 flex flex-col justify-between  p-3  `}>

            <nav className={`
${isOtherPage ? "bg-white/10 backdrop-blur-md border-slate-200 border" : "bg-black/40 backdrop-blur-md border-white/20"}
      flex px-5 py-4 items-center justify-between rounded-lg shadow
    `}>
              {/* Logo */}
              <Link to="/">
                <p className={`font-excon text-xl font-bold ${isOtherPage ? "text-black" : "text-white"}`}>
                  EquityExplorer
                </p>
              </Link>

              <div className="flex items-center gap-2">
                {isAuthed ? <UserMenu className="shrink-0" username={user?.username} /> : null}
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction={"right"} modal={false}>
                  <DrawerTrigger asChild>
                    <Button className="rounded-md uppercase bg-white text-black font-bold font-excon">Menu</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="sr-only">
                      <DrawerTitle>Navigation Menu</DrawerTitle>
                      <DrawerDescription>Browse stocks and manage your account</DrawerDescription>
                    </DrawerHeader>

                    <div className='flex flex-col sm:flex-row px-3 sm:px-5 pt-3 sm:pt-10 relative gap-2 font-excon w-full'>

                      <Field orientation="horizontal" className="w-full flex  gap-0" >
                        <Input type="search" placeholder="Search..."
                          value={searchWord}
                          onChange={handleSearchChange}
                          onKeyDown={handleKeyDown}
                          onFocus={() => setShowSuggestions(true)}
                          className={`bg-black/5 rounded-l-lg text-xs`}
                        />

                        <Button
                          onClick={() => {
                            selectTicker(searchWord);
                            setDrawerOpen(false);
                          }}
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
                              onClick={() => {
                                selectTicker(item.symbol);
                                setDrawerOpen(false);
                              }}
                              onMouseEnter={() => setSelectedIndex(index)}
                              className={`px-3 sm:px-4 py-2 sm:py-3 cursor-pointer flex justify-between items-center text-xs ${selectedIndex === index ? "bg-gray-100" : ""
                                }`}
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
                                <p className="w-full font-excon uppercase font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl active:text-[#4335d6] hover:text-[#4335d6] active:underline  underline ">{item.label}</p>
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
            </nav>

          </div>
        </>
      )}
    </>
  )
}

export default Navbar