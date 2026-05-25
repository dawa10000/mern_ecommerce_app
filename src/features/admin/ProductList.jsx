import React from 'react'
import { useGetProductsQuery } from '../product/productApi.js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '../../components/ui/button.jsx'
import { EditIcon } from 'lucide-react'
import DeleteProduct from './DeleteProduct.jsx'
import { useNavigate } from 'react-router'

export default function ProductList({ page = 1, limit = 12 }) {

  const { isLoading, error, data } = useGetProductsQuery({ page, limit });
  const nav = useNavigate();

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-64 bg-gray-200 rounded-lg mb-2 animate-pulse" />
        <div className="flex flex-wrap gap-6 mt-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-96 h-80 rounded-2xl bg-[#1f2b6c]/20 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
  if (error) return <p>{error.data?.message}</p>

  return (
    <div className='w-full mt-9'>
      <div className='[&>div]:rounded-sm [&>div]:border'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead>Name</TableHead>
              <TableHead>_id</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead className='text-right'>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.products.length === 0
              ? <TableRow><TableCell colSpan={6}>No products found.</TableCell></TableRow>
              : data.products.map(({ _id, image, price, stock, title }) => (
                <TableRow key={_id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar>
                        <AvatarImage src={image[0]?.url} alt='AV' />
                        <AvatarFallback className='text-xs'>AV</AvatarFallback>
                      </Avatar>
                      <div className='font-medium'>{title}</div>
                    </div>
                  </TableCell>
                  <TableCell>{_id}</TableCell>
                  <TableCell>{price}</TableCell>
                  <TableCell>{stock}</TableCell>
                  <TableCell>
                    <Button onClick={() => nav(`/product-edit/${_id}`)} variant='ghost'>
                      <EditIcon />
                    </Button>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DeleteProduct id={_id} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}