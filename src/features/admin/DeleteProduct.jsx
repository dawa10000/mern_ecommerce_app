import { useSelector } from 'react-redux';
import { Button } from '../../components/ui/button.jsx'
import { TrashIcon } from 'lucide-react'
import { useRemoveProductMutation } from '../product/productApi.js';
import { Spinner } from '../../components/ui/spinner.jsx';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog.jsx';


export default function DeleteProduct({ id }) {
  const { user } = useSelector((state) => state.userSlice);
  const [removeProduct, { isLoading }] = useRemoveProductMutation();
  const handleRemove = async () => {
    try {
      await removeProduct({ id, token: user.token }).unwrap();
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error(err.data.message);

    }

  }
  return (
    <div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button

            disabled={isLoading}
            variant='ghost'>
            {isLoading ? <Spinner /> : <TrashIcon />}

          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleRemove()}
            >Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>




    </div>
  )
}







