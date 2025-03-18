// components/ShareModal.tsx
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsappShareButton, TwitterShareButton, FacebookShareButton, LinkedinShareButton } from 'react-share';
import { Copy, Twitter, Facebook, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, title }) => {
  const [isCopied, setIsCopied] = useState(false);

  // useCallback é usado para evitar a recriação da função a cada renderização, otimizando a performance.
  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      toast("Event has been created", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
      })
      // Define um timeout para resetar o estado do botão após 2 segundos
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error("Erro ao copiar o link: ", err);
      toast("Erro ao copiar", {
        description: "Não foi possível copiar o link para a área de transferência.",
      })
    });
  }, [url]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar Itinerário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Input para exibir a URL e botão para copiar */}
          <div className="flex items-center space-x-2">
            <Input value={url} readOnly />
            <Button onClick={handleCopyLink} variant="outline" disabled={isCopied}>
              {isCopied ? "Copiado!" : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          {/* Botões de compartilhamento nas redes sociais */}
          <div className="flex justify-center space-x-4">
            <WhatsappShareButton url={url} title={title}>
              <Button variant="outline">
                <Twitter className="h-5 w-5" />
              </Button>
            </WhatsappShareButton>
            <TwitterShareButton url={url} title={title}>
              <Button variant="outline">
                <Twitter className="h-5 w-5" />
              </Button>
            </TwitterShareButton>
            <FacebookShareButton url={url} quote={title}>
              <Button variant="outline">
                <Facebook className="h-5 w-5" />
              </Button>
            </FacebookShareButton>
            <LinkedinShareButton url={url} title={title}>
              <Button variant="outline">
                <Linkedin className="h-5 w-5" />
              </Button>
            </LinkedinShareButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;