
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EnhancedChatPlatform from './EnhancedChatPlatform';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>MyVibeLyrics Community Platform</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <EnhancedChatPlatform />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
