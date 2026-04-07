import { SearchIcon } from "lucide-react";
import { Input } from "../../components/ui/input.jsx";
import { Formik } from "formik";
import { useNavigate } from "react-router";
import { useRef } from "react";

export default function SearchForm() {
  const nav = useNavigate();
  const inputRef = useRef(null);
  return (
    <div className='w-full max-w-xl space-y-2'>


      <Formik
        initialValues={{
          search: ''
        }}

        onSubmit={(val, { resetForm }) => {
          nav(`/search?q=${val.search}`);
          inputRef.current.blur();
          resetForm();
        }}

      >

        {({ handleChange, handleSubmit, values }) => (
          <form
            onSubmit={handleSubmit}
            className='relative'>
            <Input
              ref={inputRef}
              value={values.search}
              onChange={handleChange}
              name="search"
              id="search"
              type='search'
              placeholder='Search Products'
              className='peer pr-11 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
            />
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50'>

              <SearchIcon />

            </div>
          </form>
        )}
      </Formik>






    </div>
  )
}
