'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CodeXml, CopyIcon, Mail, Share2 } from 'lucide-react'
import {
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TwitterIcon,
  WhatsAppIcon,
} from '../ui/icons'
import { copyToClipboard, embedCode } from '@/lib/utils'
import { useCurrentUrl } from '@/hooks/use-current-url'
import { useTheme } from 'next-themes'

export default function ShareDialog() {
  const currentUrl = useCurrentUrl()

  const { theme } = useTheme()

  const shareText = `Confira Dados Agregados do IBGE: ${currentUrl}`

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
    twitter: `https://twitter.com/share?url=${currentUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}`,
    reddit: `https://reddit.com/submit?url=${currentUrl}&title=${shareText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareText}`,
    email: `mailto:?subject=Dados%Agregados%Do%IBGE!&body=${shareText}`,
  }

  const handleCopyEmbedCode = () => {
    const url = currentUrl.replace(
      '/?',
      `/frame?${theme ? `theme=${theme}&` : ''}`,
    )
    const embededCode = embedCode(url)
    copyToClipboard(embededCode)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="size-[1.2rem]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compartilhar</DialogTitle>
          <DialogDescription>
            Clique nos ícones abaixo para compartilhar nas suas plataformas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <ShareButton
            url={shareLinks.facebook}
            title="Compartilhar no Facebook"
            icon={<FacebookIcon className="size-6" />}
          />
          <ShareButton
            url={shareLinks.twitter}
            title="Compartilhar no Twitter"
            icon={<TwitterIcon className="size-6" />}
          />
          <ShareButton
            url={shareLinks.linkedin}
            title="Compartilhar no LinkedIn"
            icon={<LinkedinIcon className="size-6" />}
          />
          <ShareButton
            url={shareLinks.reddit}
            title="Compartilhar no Reddit"
            icon={<RedditIcon className="size-6" />}
          />
          <ShareButton
            url={shareLinks.whatsapp}
            title="Compartilhar no WhatsApp"
            icon={<WhatsAppIcon className="size-6" />}
          />
          <ShareButton
            url={shareLinks.email}
            title="Compartilhar via Email"
            icon={<Mail className="size-6" />}
          />
          <Button
            title="Incorporar código"
            variant="ghost"
            size="icon"
            className="mx-auto"
            onClick={handleCopyEmbedCode}
          >
            <CodeXml className="size-6" />
          </Button>
          <Button
            title="Copiar link"
            variant="ghost"
            size="icon"
            className="mx-auto"
            onClick={() => copyToClipboard(currentUrl)}
          >
            <CopyIcon className="size-6" />
          </Button>
        </div>
        <DialogFooter>
          <div>
            <DialogClose>Fechar</DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ShareButtonProps {
  url: string
  title: string
  icon: React.ReactNode
}

const ShareButton = ({ url, title, icon }: ShareButtonProps) => (
  <a
    className="flex justify-center"
    href={url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button title={title} variant="ghost" size="icon">
      {icon}
    </Button>
  </a>
)
