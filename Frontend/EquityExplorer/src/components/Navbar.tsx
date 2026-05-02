import { useIsMobile } from '../hooks/use-mobile'
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  isOtherPage: boolean
}


function Navbar({ isOtherPage }: Props) {

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
                <p className='font-excon text-xl font-bold ' >EquityExplorer</p>
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
                <Button variant="outline" className="rounded-xl text-sm hover:text-white hover:bg-black">
                  register
                  </Button>
              </Link>
            </div>
          </nav>
        </>
      }

    </>
  )
}

export default Navbar