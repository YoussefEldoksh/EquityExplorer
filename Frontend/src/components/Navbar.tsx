import { useIsMobile } from '../hooks/use-mobile'
import { Button } from './ui/button'
import { Field } from './ui/field'
import { Input } from './ui/input'
import { useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useEffect } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer'

interface Props {
  isOtherPage: boolean
}


function Navbar({ isOtherPage }: Props) {
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' },
    { label: 'Screener', ariaLabel: 'Get in touch', link: '/tickerslist' },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        await fetch(`http://${window.location.hostname}/EquityExplorer/Backend/PHP/logout.php`, {
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

  // const handleSearch = async () => {
  //   if (!searchWord.trim()) return;
  //   console.log(searchWord);

  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/api/stock/${searchWord.toUpperCase()}`);
  //     const data = await response.json();
  //     console.log(data);

  //   } catch (error) {
  //        console.error('Error fetching stock data:', error);
  //   }

  // };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}/EquityExplorer/Backend/PHP/me.php`, {
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
          <nav className={` ${isOtherPage ? "bg-white " : "fixed top-0 right-0 left-0 z-50 bg-white/10 backdrop-blur-md border border-white/20"}  flex px-10 py-2  justify-between`}>
            <div className=''>
              <a href="/">
                <p className={` font-excon text-xl font-bold ${isOtherPage ? "text-black" : "text-white" }`} >EquityExplorer</p>
              </a>

            </div>

            <div className='flex '>

              <Field orientation="horizontal" className="w-120" >
                <Input type="search" placeholder="Search..."
                  value={searchWord}
                  onChange={handleSearchChange}
                  className={`bg-white`}
                />

                <Link to={`/${searchWord}`}>
                  <Button className="hover:text-black hover:bg-white">Search</Button>
                </Link>
              </Field>

            </div>

            <div className='flex items-center gap-3 px-5 font-bold'>
              <Link to="/contact">
                <Button className='text-sm rounded-xl hover:text-white hover:bg-black ' variant="outline">Contact</Button>
              </Link>
              <Link to="/tickerslist">
                <Button className='text-sm rounded-xl text-white bg-black  hover:text-black hover:bg-white' variant="outline">Screener</Button>
              </Link>
              {isAuthed ? (
                <UserMenu username={user?.username} />
              ) : (
                <>
                  <Link to="/signin">
                    <Button variant="outline" className="rounded-xl text-sm hover:text-white hover:bg-black">
                      Sign-in
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" className="rounded-xl text-sm bg-black text-white  hover:text-black hover:bg-white">
                      register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </>
      }
      {isMobile && (
        <>

          <nav className={`
      ${isOtherPage ? "bg-white" : "bg-white/10 backdrop-blur-md border border-white/20"}
      fixed top-0 left-0 right-0 z-50
      flex px-4 py-2 items-center justify-between
    `}>
            {/* Logo */}
            <a href="/">
              <p className={`font-excon text-xl font-bold ${isOtherPage ? "text-black" : "text-white"}`}>
                EquityExplorer
              </p>
            </a>

            <div className="flex items-center gap-2">
              {isAuthed ? <UserMenu className="shrink-0" username={user?.username} /> : null}
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction={"right"}>
                <DrawerTrigger asChild>
                  <Button className="rounded-md uppercase bg-white text-black font-bold font-excon">Menu</Button>
                </DrawerTrigger>
                <DrawerContent>

                <div className='flex px-5 pt-10 '>

                  <Field orientation="horizontal" className="w-120" >
                    <Input type="search" placeholder="Search..."
                      value={searchWord}
                      onChange={handleSearchChange}
                      className={`bg-white`}
                    />

                    <Link to={`/${searchWord}`}>
                      <Button className="hover:text-black hover:bg-white">Search</Button>
                    </Link>
                  </Field>

                </div>
                {/* ... search ... */}

                <div className="flex flex-col gap-2 px-4 py-2 pt-5">
                  {(() => {
                    const list = [...menuItems];
                    if (!isAuthed) {
                      list.splice(1, 0, { label: 'Sign In', ariaLabel: 'Sign in', link: '/signin' });
                      list.splice(2, 0, { label: 'Register', ariaLabel: 'Register', link: '/register' });
                    } else {
                      list.push({ label: 'Settings', ariaLabel: 'Settings', link: '/settings' });
                    }
                    return (
                      <>
                        {list.map((item) => (
                          <Link key={item.label} to={item.link} onClick={() => setDrawerOpen(false)}>
                            <p className="w-full font-excon uppercase font-bold text-5xl ">{item.label}</p>
                          </Link>
                        ))}
                        {isAuthed && (
                          <button onClick={handleLogout} className="text-left w-full font-excon uppercase font-bold text-5xl text-red-600 hover:text-red-700">
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
        </>
      )}
    </>
  )
}

export default Navbar