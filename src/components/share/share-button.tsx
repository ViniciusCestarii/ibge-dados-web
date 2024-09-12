import { Share2 } from "lucide-react";
import { Button } from "../ui/button";

const ShareButton = () => {
  return (
    <Button variant="outline" size="icon" aria-label='compartilhar'>
      <Share2 className='size-[1.2rem]'/>
    </Button>
  )
}

export default ShareButton