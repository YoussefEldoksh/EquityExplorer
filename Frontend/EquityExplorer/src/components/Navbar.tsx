import { useIsMobile } from '../hooks/use-mobile'
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { StaggeredMenu } from './StaggeredMenu';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Menu } from 'lucide-react';

interface Props {
  isOtherPage: boolean
}


function Navbar({ isOtherPage }: Props) {
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Sign In', ariaLabel: 'Sign in to your account', link: '/signin' },
    { label: 'Register', ariaLabel: 'Create an account', link: '/register' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = useIsMobile();
  const [searchWord, setSearchWord] = useState("");

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

  return (
    <>
      {
        !isMobile &&
        <>
          <nav className={` ${isOtherPage ? "bg-white" : "fixed top-0 right-0 left-0 z-50 bg-white/10 backdrop-blur-md border border-white/20"}  flex px-10 py-2  justify-between`}>
            <div className=''>
              <a href="/">
                <p className='font-excon text-xl font-bold text-white' >EquityExplorer</p>
              </a>

            </div>

            <div className='flex '>

              <Field orientation="horizontal" className="w-120" >
                <Input type="search" placeholder="Search..."
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  className={`bg-white`}
                />

                <Link to={`/${searchWord}`}>
                  <Button className="hover:text-black hover:bg-white">Search</Button>
                </Link>
              </Field>

            </div>

            <div className='flex gap-3 px-5 font-bold'>
              <Button className='text-sm rounded-xl hover:text-white hover:bg-black ' variant="outline">Contact</Button>
              <Button className='text-sm rounded-xl text-white bg-black  hover:text-black hover:bg-white' variant="outline">About</Button>
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

            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction={"right"}>
              <DrawerTrigger asChild>
                <Button  className="rounded-md uppercase bg-white text-black font-bold font-excon">    Menu</Button>
              </DrawerTrigger>
              <DrawerContent>

                <div className='flex px-5 pt-10 '>

                  <Field orientation="horizontal" className="w-120" >
                    <Input type="search" placeholder="Search..."
                      value={searchWord}
                      onChange={(e) => setSearchWord(e.target.value)}
                      className={`bg-white`}
                    />

                    <Link to={`/${searchWord}`}>
                      <Button className="hover:text-black hover:bg-white">Search</Button>
                    </Link>
                  </Field>

                </div>
                {/* ... search ... */}

                <div className="flex flex-col gap-2 px-4 py-2 pt-5">
                  {menuItems.map((item) => (
                    <Link key={item.label} to={item.link} onClick={() => setDrawerOpen(false)}>
                      <p className="w-full font-excon uppercase font-bold text-5xl ">{item.label}</p>
                    </Link>
                  ))}
                </div>


              </DrawerContent>
            </Drawer>
          </nav>
        </>
      )}
    </>
  )
}

export default Navbar