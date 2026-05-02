import { useIsMobile } from '../hooks/use-mobile'
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from 'react';

function Navbar() {

  const isMobile = useIsMobile();
  const [searchWord, setSearchWord] = useState("");

  const handleSearch = async () => {
    if (!searchWord.trim()) return;
    const response = await fetch(`http://localhost:8000/api/stock/${searchWord.toUpperCase()}`);
    const data = await response.json();
    console.log(data);
  };

  return (
    <>
      {
        !isMobile &&
        <>
          <nav className='flex px-10 py-4 bg-transparent fixed top-0 right-0 left-0 z-50 justify-between'>
            <div className=''>
              <p className='font-excon text-xl font-bold ' >EquityExplorer</p>

            </div>

            <div className='flex '>

              <Field orientation="horizontal" className="w-120" >
                <Input type="search" placeholder="Search..."
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                <Button className="hover:text-black hover:bg-white" onClick={handleSearch}>Search</Button>
              </Field>

            </div>

            <div className='flex gap-3 px-5 font-bold'>
              <Button className='text-sm rounded-xl hover:text-white hover:bg-black' variant="outline">Contact</Button>
              <Button className='text-sm rounded-xl text-white bg-black  hover:text-black hover:bg-white' variant="outline">About</Button>
              <Button variant="outline" className="rounded-xl text-sm hover:text-white hover:bg-black" >Sign-in</Button>
              <Button variant="outline" className="rounded-xl text-sm outline-xl text-white bg-black hover:text-black hover:bg-white">register</Button>
            </div>
          </nav>
        </>
      }

    </>
  )
}

export default Navbar